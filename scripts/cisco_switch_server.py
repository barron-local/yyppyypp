import socket
import threading
import sys
import time
import json
import os
import copy

HOST = '0.0.0.0'
PORT = 2323
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(SCRIPT_DIR, "cisco_switch_config.json")

# ตัวนับและบันทึกรายชื่อผู้เชื่อมต่อปัจจุบัน
active_clients = {}  # { (ip, port): connect_time }
clients_lock = threading.Lock()

DEFAULT_CONFIG = {
    "hostname": "Switch",
    "running_config": {
        "vlans": {
            "1": "default"
        },
        "ip_routing": False,
        "interfaces": {
            # พอร์ตสวิตช์เดิมๆ จากโรงงาน ไม่มี IP ไม่มี VLAN 10/20/30
            "FastEthernet0/1": {"mode": "access", "vlan": "1"},
            "FastEthernet0/2": {"mode": "access", "vlan": "1"},
            "FastEthernet0/3": {"mode": "access", "vlan": "1"},
            "GigabitEthernet0/1": {"mode": "access", "vlan": "1"}
        },
        "dhcp_pools": {},
        "dhcp_snooping": False,
        "acl": {}
    }
}

# -----------------------------------------------------------------------------
# SHARED GLOBAL SWITCH STATE (สถานะกลางสวิตช์เครื่องเดียวที่ทุกคนแชร์ร่วมกัน)
# -----------------------------------------------------------------------------
config_lock = threading.Lock()
shared_hostname = DEFAULT_CONFIG["hostname"]
shared_running_config = copy.deepcopy(DEFAULT_CONFIG["running_config"])

def load_initial_config():
    global shared_hostname, shared_running_config
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                shared_hostname = saved.get("hostname", "Switch")
                shared_running_config = saved.get("running_config", copy.deepcopy(DEFAULT_CONFIG["running_config"]))
                return
        except Exception as e:
            print(f"[!] Warning: Failed to read {CONFIG_FILE}: {e}")
    shared_hostname = DEFAULT_CONFIG["hostname"]
    shared_running_config = copy.deepcopy(DEFAULT_CONFIG["running_config"])

# โหลดค่าเริ่มต้น
load_initial_config()

BANNER = """
*******************************************************************************
*             Cisco Catalyst 3560 L3 Switch (Competition Lab Item 58)         *
*             Practice Console - Telnet / Raw Compatible                      *
*             Type 'enable' -> 'configure terminal' to configure              *
*             Type 'write' / 'copy run start' to save config to disk          *
*******************************************************************************
"""

class CiscoSwitchSession:
    def __init__(self, client_socket, client_addr=None):
        self.sock = client_socket
        self.client_addr = client_addr or ("unknown", 0)
        self.mode = "user"  # 'user', 'privileged', 'config', 'config-if', 'config-vlan', 'config-dhcp'
        self.submode_target = ""

    @property
    def hostname(self):
        with config_lock:
            return shared_hostname

    @hostname.setter
    def hostname(self, val):
        global shared_hostname
        with config_lock:
            shared_hostname = val

    @property
    def running_config(self):
        return shared_running_config

    def save_config(self):
        try:
            with config_lock:
                data = {
                    "hostname": shared_hostname,
                    "running_config": shared_running_config
                }
                with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"[!] Error saving config: {e}")
            return False

    def send_raw(self, b):
        try:
            self.sock.sendall(b)
        except Exception:
            pass

    def send(self, text):
        formatted = text.replace('\r\n', '\n').replace('\n', '\r\n')
        self.send_raw(formatted.encode('utf-8'))

    def get_prompt(self):
        if self.mode == "user":
            return f"{self.hostname}>"
        elif self.mode == "privileged":
            return f"{self.hostname}#"
        elif self.mode == "config":
            return f"{self.hostname}(config)#"
        elif self.mode == "config-if":
            return f"{self.hostname}(config-if)#"
        elif self.mode == "config-vlan":
            return f"{self.hostname}(config-vlan)#"
        elif self.mode == "config-dhcp":
            return f"{self.hostname}(dhcp-config)#"
        return f"{self.hostname}#"

    def handle(self):
        # 1. Do NOT send raw IAC negotiations initially to prevent PuTTY waiting indefinitely
        # 2. Immediately send Banner + Prompt
        self.send(BANNER)
        self.send("User Access Verification\r\n\r\n")
        self.send(self.get_prompt() + " ")

        buffer = ""
        while True:
            try:
                data = self.sock.recv(1024)
                if not data:
                    break

                i = 0
                while i < len(data):
                    b = data[i]

                    # Filter Telnet Command Sequence (IAC 0xFF)
                    if b == 255:
                        if i + 2 < len(data):
                            verb = data[i+1]
                            opt = data[i+2]
                            # Auto respond DONT / WONT to reject special Telnet subnegotiations
                            if verb == 251:  # WILL -> reply DONT
                                self.send_raw(bytes([255, 254, opt]))
                            elif verb == 253:  # DO -> reply WONT
                                self.send_raw(bytes([255, 252, opt]))
                            i += 3
                            continue
                        elif i + 1 < len(data):
                            i += 2
                            continue
                        else:
                            i += 1
                            continue

                    # Enter key pressed (\r or \n)
                    if b in (10, 13):
                        # Skip paired character (\r\n or \r\0)
                        if b == 13 and i + 1 < len(data) and data[i+1] in (10, 0):
                            i += 1
                        self.send("\r\n")
                        cmd = buffer.strip()
                        buffer = ""
                        if cmd:
                            self.execute_command(cmd)
                        self.send(self.get_prompt() + " ")
                    elif b in (8, 127):  # Backspace / DEL
                        if len(buffer) > 0:
                            buffer = buffer[:-1]
                            self.send("\b \b")
                    elif 32 <= b <= 126:  # Printable ASCII
                        char = chr(b)
                        buffer += char
                        # Echo character back to terminal
                        self.send(char)
                    i += 1

            except Exception:
                break

    def execute_command(self, cmd_line):
        parts = cmd_line.split()
        if not parts:
            return

        cmd = parts[0].lower()
        args = parts[1:]

        # Global commands
        if cmd == "exit":
            if self.mode in ("config-if", "config-vlan", "config-dhcp"):
                self.mode = "config"
            elif self.mode == "config":
                self.mode = "privileged"
            elif self.mode == "privileged":
                self.mode = "user"
            elif self.mode == "user":
                self.send("\r\nConnection closed by foreign host.\r\n")
                self.sock.close()
            return
        elif cmd == "end":
            if self.mode.startswith("config"):
                self.mode = "privileged"
            return
        elif cmd == "disable":
            self.mode = "user"
            return

        # Handle 'do show ...' in any config mode
        if cmd == "do" and args:
            self.handle_show(args)
            return

        # Direct 'show' in sub-config mode: also allow for student convenience
        if cmd in ("show", "sh") and self.mode != "user":
            self.handle_show(args)
            return

        # USER MODE
        if self.mode == "user":
            if cmd in ("enable", "en"):
                self.mode = "privileged"
                return
            elif cmd == "ping":
                target = args[0] if args else "192.168.10.1"
                self.send(f"Type escape sequence to abort.\r\nSending 5, 100-byte ICMP Echos to {target}, timeout is 2 seconds:\r\n!!!!!\r\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms\r\n")
                return
            elif cmd in ("show", "sh"):
                self.send("% Type 'enable' first to view full privileged configuration.\r\n")
                return
            elif cmd in ("?", "help"):
                self.send("\r\nExec commands:\r\n  enable    Turn on privileged commands\r\n  exit      Exit from the EXEC\r\n  ping      Send echo messages\r\n")
                return
            else:
                self.send(f"% Unknown command: '{cmd_line}' (Type 'enable' to enter privileged mode)\r\n")
                return

        # PRIVILEGED MODE
        if self.mode == "privileged":
            if cmd in ("configure", "conf") and args and args[0] in ("terminal", "t"):
                self.mode = "config"
                self.send("Enter configuration commands, one per line.  End with CNTL/Z.\r\n")
                return
            elif cmd in ("show", "sh"):
                self.handle_show(args)
                return
            elif cmd in ("write", "wr") or (cmd == "copy" and len(args) >= 2 and args[0] == "run" and args[1] == "start"):
                self.send("Building configuration...\r\n")
                if self.save_config():
                    self.send("[OK] Configuration saved to persistent storage.\r\n")
                else:
                    self.send("[Error] Failed to write configuration to disk.\r\n")
                return
            elif (cmd == "write" and args and args[0] == "erase") or (cmd == "erase" and args and args[0] == "startup-config"):
                try:
                    global shared_hostname, shared_running_config
                    with config_lock:
                        if os.path.exists(CONFIG_FILE):
                            os.remove(CONFIG_FILE)
                        shared_hostname = DEFAULT_CONFIG["hostname"]
                        shared_running_config = copy.deepcopy(DEFAULT_CONFIG["running_config"])
                    self.send("Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]\r\n[OK] Erase of nvram: complete\r\n% Configuration reset to default.\r\n")
                except Exception as e:
                    self.send(f"% Error erasing config: {e}\r\n")
                return
            elif cmd == "reload":
                load_initial_config()
                self.send("Proceed with reload? [confirm]\r\n% System reloaded from startup-config.\r\n")
                return
            elif cmd == "ping":
                target = args[0] if args else "192.168.10.1"
                self.send(f"Type escape sequence to abort.\r\nSending 5, 100-byte ICMP Echos to {target}, timeout is 2 seconds:\r\n!!!!!\r\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms\r\n")
                return

        # CONFIG MODE
        if self.mode == "config":
            if cmd == "hostname":
                if args:
                    self.hostname = args[0]
                return
            elif cmd == "ip" and args and args[0] == "routing":
                self.running_config["ip_routing"] = True
                self.send("% IP routing enabled on Layer 3 Switch.\r\n")
                return
            elif cmd == "vlan" and args:
                vlan_id = args[0]
                self.submode_target = vlan_id
                if vlan_id not in self.running_config["vlans"]:
                    self.running_config["vlans"][vlan_id] = f"VLAN{vlan_id}"
                self.mode = "config-vlan"
                return
            elif cmd in ("interface", "int") and args:
                if_name = args[0]
                self.submode_target = if_name
                if if_name not in self.running_config["interfaces"]:
                    self.running_config["interfaces"][if_name] = {"ip": "unassigned", "mask": "", "status": "up"}
                self.mode = "config-if"
                return
            elif cmd == "ip" and len(args) >= 3 and args[0] == "dhcp" and args[1] == "pool":
                pool_name = args[2]
                self.submode_target = pool_name
                if pool_name not in self.running_config["dhcp_pools"]:
                    self.running_config["dhcp_pools"][pool_name] = {}
                self.mode = "config-dhcp"
                return
            elif cmd == "ip" and len(args) >= 2 and args[0] == "dhcp" and args[1] == "snooping":
                self.running_config["dhcp_snooping"] = True
                self.send("% DHCP snooping enabled globally.\r\n")
                return

        # CONFIG-VLAN
        if self.mode == "config-vlan":
            if cmd == "name" and args:
                self.running_config["vlans"][self.submode_target] = args[0]
                return
            elif cmd == "vlan" and args:
                vlan_id = args[0]
                self.submode_target = vlan_id
                if vlan_id not in self.running_config["vlans"]:
                    self.running_config["vlans"][vlan_id] = f"VLAN{vlan_id}"
                return

        # CONFIG-IF
        if self.mode == "config-if":
            if cmd == "ip" and len(args) >= 3 and args[0] == "address":
                self.running_config["interfaces"][self.submode_target]["ip"] = args[1]
                self.running_config["interfaces"][self.submode_target]["mask"] = args[2]
                return
            elif cmd == "no" and args and args[0] == "shutdown":
                self.running_config["interfaces"][self.submode_target]["status"] = "up"
                self.send(f"% Interface {self.submode_target}, changed state to up\r\n")
                return
            elif cmd == "switchport" and len(args) >= 3 and args[0] == "mode":
                self.running_config["interfaces"][self.submode_target]["mode"] = args[1]
                return
            elif cmd == "switchport" and len(args) >= 4 and args[0] == "access" and args[1] == "vlan":
                self.running_config["interfaces"][self.submode_target]["vlan"] = args[2]
                return
            elif cmd == "ip" and len(args) >= 3 and args[0] == "dhcp" and args[1] == "snooping" and args[2] == "trust":
                self.running_config["interfaces"][self.submode_target]["trust"] = True
                self.send(f"% Port {self.submode_target} set as DHCP Snooping TRUST port.\r\n")
                return

        # CONFIG-DHCP
        if self.mode == "config-dhcp":
            if cmd == "network" and len(args) >= 2:
                self.running_config["dhcp_pools"][self.submode_target]["network"] = f"{args[0]} {args[1]}"
                return
            elif cmd == "default-router" and args:
                self.running_config["dhcp_pools"][self.submode_target]["router"] = args[0]
                return
            elif cmd == "dns-server" and args:
                self.running_config["dhcp_pools"][self.submode_target]["dns"] = args[0]
                return

        self.send(f"% Command accepted: {cmd_line}\r\n")

    def handle_show(self, args):
        if not args:
            self.send("% Incomplete show command. Try 'show ip int brief', 'show vlan brief', 'show ip route', 'show run'\r\n")
            return

        sub = " ".join(args).lower()
        if "vlan" in sub:
            out = "\r\nVLAN Name                             Status    Ports\r\n"
            out += "---- -------------------------------- --------- -------------------------------\r\n"
            out += "1    default                          active    Fa0/4, Fa0/5, Fa0/6\r\n"
            for vid, vname in self.running_config["vlans"].items():
                ports = "Fa0/1" if vid == "10" else ("Fa0/2" if vid == "20" else ("Fa0/3" if vid == "30" else "Gig0/1"))
                out += f"{vid:<4} {vname:<32} active    {ports}\r\n"
            self.send(out)
        elif "ip int brief" in sub or "ip interface brief" in sub:
            out = "\r\nInterface              IP-Address      OK? Method Status                Protocol\r\n"
            for ifname, data in self.running_config["interfaces"].items():
                ip = data.get("ip", "unassigned")
                status = data.get("status", "up")
                out += f"{ifname:<22} {ip:<15} YES manual {status:<21} up\r\n"
            self.send(out)
        elif "ip route" in sub:
            out = "\r\nCodes: C - connected, S - static, R - RIP, M - mobile, B - BGP\r\nGateway of last resort is not set\r\n\r\n"
            out += "C    192.168.10.0/24 is directly connected, Vlan10\r\n"
            out += "C    192.168.20.0/24 is directly connected, Vlan20\r\n"
            out += "C    192.168.30.0/24 is directly connected, Vlan30\r\n"
            out += "C    192.168.99.0/24 is directly connected, Vlan99\r\n"
            self.send(out)
        elif "dhcp" in sub:
            out = "\r\nDHCP Server Status: Active\r\n"
            for pname, pdata in self.running_config["dhcp_pools"].items():
                out += f"Pool: {pname} | Network: {pdata.get('network', 'N/A')} | Gateway: {pdata.get('router', 'N/A')}\r\n"
            self.send(out)
        elif "access-lists" in sub or "access-list" in sub or "acl" in sub:
            out = "\r\nExtended IP access list ACL_SERVER_PROTECT\r\n"
            for idx, line in enumerate(self.running_config["acl"]["ACL_SERVER_PROTECT"], 10):
                out += f"    {idx} {line} (102 matches)\r\n"
            self.send(out)
        elif "run" in sub or "running-config" in sub:
            out = "\r\n! Current configuration\r\nversion 15.2\r\n"
            out += f"hostname {self.hostname}\r\n!\r\n"
            if self.running_config.get("ip_routing"):
                out += "ip routing\r\n!\r\n"
            for vid, vname in self.running_config.get("vlans", {}).items():
                out += f"vlan {vid}\r\n name {vname}\r\n!\r\n"
            if self.running_config.get("dhcp_snooping"):
                out += "ip dhcp snooping\r\nip dhcp snooping vlan 10,20,30\r\n!\r\n"
            for pname, pdata in self.running_config.get("dhcp_pools", {}).items():
                out += f"ip dhcp pool {pname}\r\n"
                if "network" in pdata:
                    out += f" network {pdata['network']}\r\n"
                if "router" in pdata:
                    out += f" default-router {pdata['router']}\r\n"
                if "dns" in pdata:
                    out += f" dns-server {pdata['dns']}\r\n"
                out += "!\r\n"
            for ifname, ifdata in self.running_config.get("interfaces", {}).items():
                out += f"interface {ifname}\r\n"
                if ifname.startswith("Vlan"):
                    if ifdata.get("ip") and ifdata.get("ip") != "unassigned":
                        out += f" ip address {ifdata.get('ip')} {ifdata.get('mask', '255.255.255.0')}\r\n"
                    if ifdata.get("status") == "up":
                        out += " no shutdown\r\n"
                else:
                    mode = ifdata.get("mode", "access")
                    out += f" switchport mode {mode}\r\n"
                    if mode == "access" and "vlan" in ifdata:
                        out += f" switchport access vlan {ifdata['vlan']}\r\n"
                    if ifdata.get("trust"):
                        out += " ip dhcp snooping trust\r\n"
                    out += " spanning-tree portfast\r\n"
                out += "!\r\n"
            for acl_name, rules in self.running_config.get("acl", {}).items():
                out += f"ip access-list extended {acl_name}\r\n"
                for rule in rules:
                    out += f" {rule}\r\n"
                out += "!\r\n"
            out += "end\r\n"
            self.send(out)
        elif sub in ["users", "who"]:
            # คำสั่ง show users ตามมาตรฐาน Cisco IOS
            with clients_lock:
                total = len(active_clients)
                out = f"\r\n    Line       User       Host(s)              Idle       Location\r\n"
                for idx, (c_addr, c_time) in enumerate(active_clients.items(), start=1):
                    is_me = "*" if c_addr == self.client_addr else " "
                    idle_secs = int(time.time() - c_time)
                    idle_str = f"{idle_secs}s" if idle_secs < 60 else f"{idle_secs//60}m"
                    out += f" {is_me}  vty {idx:<6} admin      idle                 {idle_str:<10} {c_addr[0]}:{c_addr[1]}\r\n"
                out += f"\r\n  Total active sessions: {total} user(s) connected.\r\n"
            self.send(out)
        else:
            self.send(f"% Unknown show argument: '{sub}'\r\n")


def client_handler(sock, addr):
    with clients_lock:
        active_clients[addr] = time.time()
        count = len(active_clients)
    print(f"\r\n[+] [CONNECTED] ผู้ใช้เข้ามาใหม่จาก IP: {addr[0]}:{addr[1]} (ขณะนี้มีคนออนไลน์: {count} คน)")
    sys.stdout.flush()

    try:
        session = CiscoSwitchSession(sock, addr)
        session.handle()
    except Exception as e:
        print(f"\r\n[!] Error handling client {addr}: {e}")
    finally:
        with clients_lock:
            active_clients.pop(addr, None)
            remaining = len(active_clients)
        print(f"\r\n[-] [DISCONNECTED] ผู้ใช้ {addr[0]}:{addr[1]} ออกไปแล้ว (เหลือคนออนไลน์: {remaining} คน)")
        sys.stdout.flush()
        try:
            sock.close()
        except Exception:
            pass

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((HOST, PORT))
    server.listen(10)
    server.settimeout(1.0)
    print("=" * 65)
    print(f"🚀 Cisco L3 Switch Server พร้อมให้บริการแล้ว!")
    print(f"📡 พอร์ต: {PORT} (เปิดรับทุก IP: 0.0.0.0)")
    print(f"👥 ระบบตรวจนับผู้ใช้งานแบบเรียลไทม์: พร้อมใช้งาน")
    print("=" * 65)
    print(f"[*] ทดสอบเข้าจากเครื่องนี้:  PuTTY -> 127.0.0.1 พอร์ต {PORT} (Telnet)")
    print(f"[*] ให้เพื่อนเข้าจากนอกเครื่อง: PuTTY -> <IP_ของคุณ> พอร์ต {PORT}")
    print(f"[*] กด Ctrl + C เพื่อปิดเซิร์ฟเวอร์")
    print("=" * 65)
    sys.stdout.flush()

    running = True
    while running:
        try:
            client, addr = server.accept()
            t = threading.Thread(target=client_handler, args=(client, addr), daemon=True)
            t.start()
        except socket.timeout:
            continue
        except (KeyboardInterrupt, SystemExit):
            print("\r\n[*] Stopping Cisco Switch Server cleanly...")
            running = False
            break
        except Exception as e:
            print(f"Accept error: {e}")

    server.close()
    print("[*] Server stopped successfully.")

if __name__ == '__main__':
    main()

#!/bin/bash
# ==============================================================================
# SCRIPT: UBUNTU SERVER 22.04 / 24.04 SETUP & HARDENING (รายการที่ 58)
# สอดคล้องเกณฑ์ข้อ 2.1, 2.2, 2.3:
# - ตั้งค่า Static IP, Hostname, Domain
# - เปิด SSH, สร้าง 2 Users, Sudo NOPASSWD (-i)
# - ตั้งค่า UFW Firewall เปิดเฉพาะพอร์ตที่กำหนด
# ==============================================================================

set -e

echo "🚀 [1/5] Setting Hostname and Domain..."
NEW_HOSTNAME="server.competition.lab"
hostnamectl set-hostname $NEW_HOSTNAME
echo "127.0.0.1 $NEW_HOSTNAME" >> /etc/hosts

echo "🌐 [2/5] Configuring Static IP via Netplan..."
# หมายเหตุ: ตรวจสอบชื่อ Network Interface (เช่น eth0, ens18, ens33) ด้วยคำสั่ง 'ip a'
INTERFACE_NAME=$(ip -o link show | awk -F': ' '{print $2}' | grep -v 'lo' | head -n 1)

cat <<EOF > /etc/netplan/00-installer-config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    $INTERFACE_NAME:
      dhcp4: no
      addresses:
        - 192.168.10.10/24
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses:
          - 192.168.10.10
          - 8.8.8.8
        search:
          - competition.lab
EOF

netplan apply || true

echo "👤 [3/5] Creating 2 Users and configuring Sudo NOPASSWD..."
# เกณฑ์: เพิ่ม User อย่างน้อย 2 User และสามารถใช้ sudo -i โดยไม่ต้องยืนยันรหัสผ่าน
USERS=("devops_admin" "app_deployer")

for USER in "${USERS[@]}"; do
    if ! id -u "$USER" >/dev/null 2>&1; then
        useradd -m -s /bin/bash "$USER"
        echo "$USER:Password123!" | chpasswd
        usermod -aG sudo "$USER"
        echo "Created user: $USER"
    fi
done

# กำหนดสิทธิ์ NOPASSWD ใน /etc/sudoers.d/
cat <<EOF > /etc/sudoers.d/99-devops-users
devops_admin ALL=(ALL) NOPASSWD: ALL
app_deployer ALL=(ALL) NOPASSWD: ALL
EOF
chmod 0440 /etc/sudoers.d/99-devops-users

echo "🔐 [4/5] Configuring SSH Service & Custom Port..."
# เปิด SSH บนพอร์ต 22 หรือพอร์ตที่กรรมการกำหนด (เช่น 2222)
systemctl enable ssh
systemctl start ssh

echo "🛡️ [5/5] Configuring UFW Firewall..."
# เกณฑ์: ตั้งค่า firewall เพื่อเปิดพอร์ตบริการตามที่กรรมการกำหนด
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# เปิดพอร์ตที่จำเป็น
ufw allow 22/tcp comment "SSH Remote Management"
ufw allow 80/tcp comment "HTTP Web Proxy"
ufw allow 443/tcp comment "HTTPS SSL Proxy"
ufw allow 53 comment "DNS Service"
ufw allow 1883/tcp comment "MQTT Broker"
ufw allow 8080/tcp comment "GitLab Web UI"
ufw allow 5000/tcp comment "Docker Private Registry"

ufw --force enable

echo "✅ [SUCCESS] Linux Server Setup completed!"
echo "Status Verification:"
hostname -f
ip a show $INTERFACE_NAME
ufw status verbose

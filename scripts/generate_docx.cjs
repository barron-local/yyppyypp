const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');

async function createLabDoc() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "คู่มือการจำลอง Network Server กลาง (Lab Simulation) สำหรับซ้อมสอบ VECSkill",
            heading: HeadingLevel.TITLE,
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "เอกสารนี้แนะนำวิธีการสร้างวงแลนจำลองเสมือนสนามสอบจริง โดยใช้ VMware Workstation Virtual Network Editor เพื่อให้ได้วงเครือข่าย 192.168.10.0/24 และสามารถซ้อมติดตั้ง Ubuntu Server ด้วยเลข IP ตายตัวตามเกณฑ์สอบได้ 100%",
                italics: true
              })
            ],
            spacing: { after: 400 }
          }),

          new Paragraph({
            text: "1. ภาพรวมการตั้งค่าวงแลนจำลอง (Standard Competition Network)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),
          new Paragraph({
            text: "การกำหนดสเปกวงเครือข่ายกลางสำหรับการฝึกซ้อม:",
            spacing: { after: 200 }
          }),

          // Table summary
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "พารามิเตอร์ (Parameter)", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "ค่าที่กำหนด (Value)", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "คำอธิบาย / หน้าที่", bold: true })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Virtual Adapter" })] }),
                  new TableCell({ children: [new Paragraph({ text: "VMnet8 (หรือ VMnet2)" })] }),
                  new TableCell({ children: [new Paragraph({ text: "การ์ด NAT ประจำเครื่อง VMware" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Subnet Network" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.0/24" })] }),
                  new TableCell({ children: [new Paragraph({ text: "วงเครือข่ายหลักสนามสอบ (Subnet Mask: 255.255.255.0)" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Virtual Gateway IP" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.1" })] }),
                  new TableCell({ children: [new Paragraph({ text: "เกตเวย์กลางเสมือน ทำหน้าที่ออกเน็ตและเชื่อมโยงเครือข่าย" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Server Static IP" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.10" })] }),
                  new TableCell({ children: [new Paragraph({ text: "IP ประจำเครื่อง devops-server ตามโจทย์ข้อสอบ" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "DNS Nameservers" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.1, 8.8.8.8" })] }),
                  new TableCell({ children: [new Paragraph({ text: "DNS ของวงแลน + DNS สำรองภายนอก" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Search Domains" })] }),
                  new TableCell({ children: [new Paragraph({ text: "competition.lab" })] }),
                  new TableCell({ children: [new Paragraph({ text: "โดเมนประจำสนามสอบ VECSkill" })] })
                ]
              })
            ]
          }),

          new Paragraph({
            text: "2. ขั้นตอนการตั้งค่าใน VMware Virtual Network Editor (ทำครั้งเดียว)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            text: "1. เปิดโปรแกรม VMware Workstation Pro บน Windows",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "2. คลิกแถบเมนูด้านบน Edit > Virtual Network Editor... (หากมีปุ่ม Change Settings รูปโล่สีฟ้า ให้คลิกเพื่อให้ได้สิทธิ์ Administrator)",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "3. เลือกการ์ด VMnet8 (หรือคลิก Add Network... สร้าง VMnet2 ขึ้นมาใหม่)",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "4. กำหนดการตั้งค่าด้านล่างดังนี้:\n   - ติ๊กเลือก: NAT (shared host's IP address with VMs)\n   - ติ๊กถูก: [x] Connect a host virtual adapter to this network\n   - ติ๊กถูก: [x] Use local DHCP service to distribute IP address to VMs\n   - ช่อง Subnet IP: กำหนดเป็น 192.168.10.0\n   - ช่อง Subnet mask: กำหนดเป็น 255.255.255.0",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "5. คลิกปุ่ม 'NAT Settings...':\n   - ตรวจสอบ Gateway IP ให้เป็น: 192.168.10.1\n   - คลิก OK",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "6. คลิก Apply และกด OK เพื่อบันทึกการตั้งค่า",
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: "3. การผูก VM (devops-server) เข้ากับวงเครือข่ายกลาง",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            text: "1. ในหน้าต่าง VMware Workstation คลิกขวาที่ VM devops-server > เลือก Settings...",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "2. เลือกหัวข้อ Network Adapter ทางด้านซ้าย",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "3. ทางขวาเลือกติ๊ก: 'Custom: Specific virtual network' แล้วเลือก VMnet8 (NAT) (หรือชื่อ VMnet ที่ตั้งวง 192.168.10.0)",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "4. คลิกปุ่ม OK",
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: "4. ข้อมูลที่ใช้กรอกในหน้าติดตั้ง Ubuntu Server (Network configuration)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            text: "เมื่ออยู่ที่หน้าจอสีส้ม 'Network configuration' ของตัวติดตั้ง Ubuntu Server:\n1. ใช้ปุ่มลูกศรเลื่อนไปที่แถบ [ ens33  eth  -  ▶ ] แล้วกด Enter\n2. เลือกเมนู 'Edit IPv4'\n3. เปลี่ยนจาก Automatic (DHCP) เป็น 'Manual'\n4. กรอกตัวเลขตามตารางดังนี้:",
            spacing: { after: 150 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "ช่องกรอก (Field)", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "ค่าที่ต้องพิมพ์ (Value)", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "ความหมาย", bold: true })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Subnet" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.0/24" })] }),
                  new TableCell({ children: [new Paragraph({ text: "ระบุ Subnet ID ของสนามสอบพร้อม Prefix /24" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Address" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.10" })] }),
                  new TableCell({ children: [new Paragraph({ text: "IP ของเครื่อง Server ตามโจทย์" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Gateway" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.1" })] }),
                  new TableCell({ children: [new Paragraph({ text: "IP ของ Gateway กลางสนามสอบ" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Name servers" })] }),
                  new TableCell({ children: [new Paragraph({ text: "192.168.10.1,8.8.8.8" })] }),
                  new TableCell({ children: [new Paragraph({ text: "DNS สนามสอบ และ Public DNS สำรอง" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Search domains" })] }),
                  new TableCell({ children: [new Paragraph({ text: "competition.lab" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Domain Name ของสนามสอบ" })] })
                ]
              })
            ]
          }),

          new Paragraph({
            text: "5. เลื่อนไปกด 'Save' จากนั้นจะมีปุ่ม '[ Done ]' ปรากฏขึ้นมาด้านล่าง ให้กด Done เพื่อไปตั้งค่า Storage ต่อไป",
            spacing: { before: 150, after: 200 }
          }),

          new Paragraph({
            text: "5. วิธีค้นหาข้อมูล Network จากเครื่องจริง (Host Discovery)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            text: "หากต้องการทราบว่าเครื่องจริงของคุณใช้วงเน็ตใด (เช่น วง Wi-Fi หรือ LAN ของสถานที่สอบจริง):\n1. เปิด PowerShell หรือ Command Prompt\n2. รันคำสั่ง:\n   ipconfig /all\n3. สังเกตหัวข้อการ์ดเครือข่ายที่ใช้งาน:\n   - IPv4 Address: เช่น 192.168.1.37 (บ่งบอกวง 192.168.1.x)\n   - Subnet Mask: 255.255.255.0 (บ่งบอก Prefix /24)\n   - Default Gateway: เช่น 192.168.1.1\n   - DNS Servers: เช่น 192.168.1.1 หรือ 8.8.8.8\nสามารถนำค่าเหล่านี้มาประยุกต์เข้ากับตารางด้านบนได้ทันที",
            spacing: { after: 200 }
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('C:/Users/Woradech/Desktop/yypp/คู่มือ_Network_Lab_Simulation_VECSkill.docx', buffer);
  console.log('Successfully generated คู่มือ_Network_Lab_Simulation_VECSkill.docx');
}

createLabDoc();

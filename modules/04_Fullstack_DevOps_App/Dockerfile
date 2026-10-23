# ==============================================================================
# DOCKERFILE: DevOps Competition Web & API Application
# เกณฑ์ข้อ 2.5 & 4.6: "สร้างและใช้งาน Dockerfile สำหรับแอป Node/เว็บที่พัฒนาได้"
# ==============================================================================

# ใช้ Base Image Node.js 18 Alpine ขนาดกะทัดรัด
FROM node:18-alpine

# กำหนด Working Directory ภายใน Container
WORKDIR /app

# ติดตั้ง System Dependencies (ถ้าจำเป็น)
RUN apk add --no-cache curl

# คัดลอกเฉพาะ package.json เพื่อใช้ประโยชน์จาก Docker Layer Caching
COPY package*.json ./

# ติดตั้งเฉพาะ Production Dependencies
RUN npm install --omit=dev

# คัดลอก Source Code ทั้งหมดเข้าสู่ Container
COPY . .

# สร้างโฟลเดอร์ uploads และกำหนดสิทธิ์
RUN mkdir -p backend/uploads

# กำหนด Environment Variables
ENV NODE_ENV=production
ENV PORT=3000

# เปิดพอร์ตที่แอปพลิเคชันรัน
EXPOSE 3000

# Healthcheck เพื่อให้ Docker Monitor ตรวจสอบสถานะว่าระบบพร้อมบริการหรือไม่
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# คำสั่งเริ่มต้นการทำงานของแอปพลิเคชัน
CMD ["node", "backend/server.js"]

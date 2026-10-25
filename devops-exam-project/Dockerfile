# ==============================================================================
# DOCKERFILE: DevOps Competition Web & API Application
# เกณฑ์ข้อ 2.5 & 4.6: "สร้างและใช้งาน Dockerfile สำหรับแอป Node/เว็บที่พัฒนาได้"
# ==============================================================================

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

COPY . .

RUN mkdir -p backend/uploads

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "backend/server.js"]
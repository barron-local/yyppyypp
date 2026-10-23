# 🦊 คู่มือการติดตั้ง GitLab Server, GitLab Runner และเชื่อมต่อ CI/CD
**เกณฑ์ข้อ 2.4, 2.6, 2.7 (คะแนนเต็มรวม 5 คะแนน)**

---

## 🚀 1. การติดตั้ง GitLab Community Edition (CE) ด้วย Docker

รันคำสั่งบน Linux Server VM:

```bash
docker run -d \
  --name gitlab-server \
  --restart always \
  --hostname gitlab.competition.lab \
  -p 8080:80 \
  -p 8443:443 \
  -p 2222:22 \
  -v /srv/gitlab/config:/etc/gitlab \
  -v /srv/gitlab/logs:/var/log/gitlab \
  -v /srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

### 1.1 ดูรหัสผ่านเริ่มต้นของ root
เมื่อคอนเทนเนอร์เริ่มทำงาน ให้รันคำสั่งเพื่อดู Initial Password:
```bash
docker exec -it gitlab-server grep 'Password:' /etc/gitlab/initial_root_password
```
*(เข้าเว็บ http://192.168.10.10:8080 หรือผ่าน Reverse Proxy https://gitlab.competition.lab แล้ว Login ด้วย `root`)*

### 1.2 สร้าง User ใหม่ใน GitLab (เกณฑ์ 2.4: สร้าง User ใน Gitlab และเข้าหน้า UI ได้)
1. เข้าไปที่เมนู **Admin Area** (ไอคอนประแจมุมบนซ้าย) -> **Overview** -> **Users**
2. กด **New User**:
   - Name: `DevOps Team`
   - Username: `devops_student`
   - Email: `student@competition.lab`
   - Access Level: `Regular` หรือ `Administrator`
3. กำหนดรหัสผ่านใหม่ เช่น `StudentPassword123!`
4. ทดสอบ Logout แล้ว Login ด้วย user ใหม่นี้ให้กรรมการดู

---

## 🏃 2. การติดตั้งและลงทะเบียน GitLab Runner (แบบ Docker Executor)

GitLab Runner คือตัวที่จะรัน Script ใน `.gitlab-ci.yml` เมื่อมีการ Push โค้ด:

### 2.1 รัน GitLab Runner Container
```bash
docker run -d \
  --name gitlab-runner \
  --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  gitlab/gitlab-runner:latest
```

### 2.2 ลงทะเบียน Runner เข้ากับโปรเจกต์ (Register Runner)
1. ใน GitLab เข้าไปที่ Project ของคุณ -> **Settings** -> **CI/CD** -> ขยายส่วน **Runners**
2. คัดลอก **Registration Token** (หรือสร้าง New Project Runner)
3. รันคำสั่ง Register ในเทอร์มินัล:
```bash
docker exec -it gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "http://192.168.10.10:8080/" \
  --registration-token "<YOUR_TOKEN_HERE>" \
  --executor "docker" \
  --docker-image "node:18-alpine" \
  --description "competition-docker-runner" \
  --docker-privileged \
  --docker-volumes "/var/run/docker.sock:/var/run/docker.sock"
```
4. เช็คที่หน้าเว็บ GitLab จะเห็นไฟสถานะ Runner เป็น **สีเขียว (Active)** พร้อมใช้งาน

---

## ⚡ 3. กฎเหล็กของไฟล์ `.gitlab-ci.yml` ให้ได้ 2 คะแนนเต็ม
> ⚠️ **กติกาสำคัญมาก:** กรรมการตรวจว่า:
> 1. มีครบทั้ง 4 stages: `build`, `test`, `push`, `deploy`
> 2. Push โค้ดแล้วเกิด Trigger อัตโนมัติจริง
> 3. ทำงานผ่านและสำเร็จ (Passed) สีเขียวครบทุกขั้นตอน (ถ้าติด fail ขั้นตอนใดขั้นตอนหนึ่ง = 0 คะแนน!)

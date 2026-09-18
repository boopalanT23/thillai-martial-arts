# Deployment Guide — THILLAI MARTIAL ARTS CLUB

This guide covers taking the application from local development to a live
production environment.

---

## 1. Pre-deployment checklist

- [ ] Generate a strong, random `JWT_SECRET` (`openssl rand -base64 48`)
- [ ] Set a strong `ADMIN_PASSWORD` — the default seeded account is the only
      way into the Admin Panel until you create more admins
- [ ] Switch Razorpay keys from `rzp_test_…` to live `rzp_live_…` keys
- [ ] Create a Gmail **App Password** (Google Account → Security → App
      Passwords) for `MAIL_PASSWORD` — your real Gmail password will not work
      with SMTP auth
- [ ] Point `CORS_ALLOWED_ORIGINS` at your real frontend domain(s)
- [ ] Decide on file storage: local disk (default, fine for a single-server
      deployment) or migrate `FileStorageService` to S3/GCS/Azure Blob for
      multi-instance/horizontally-scaled deployments
- [ ] Switch `spring.jpa.hibernate.ddl-auto` from `update` to `validate` and
      introduce Flyway/Liquibase migrations for controlled schema changes

---

## 2. Option A — Single VM with Docker Compose

The included `docker-compose.yml` is production-capable for a single-server
deployment (e.g. a DigitalOcean droplet, AWS EC2, or similar):

```bash
git clone <your-repo>
cd thillai-martial-arts
cp .env.example .env
nano .env   # fill in real production secrets

docker compose up -d --build
```

Put a reverse proxy (Nginx or Caddy) in front of ports 3000/8080 to terminate
TLS and serve both under one domain, e.g.:

```nginx
server {
    listen 443 ssl;
    server_name thillaimartialarts.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
    }

    location /uploads/ {
        proxy_pass http://localhost:8080;
    }
}
```

[Certbot](https://certbot.eff.org/) is the easiest way to issue a free TLS
certificate for the domain above.

**Backups:** the `mysql_data` and `uploads_data` Docker volumes hold
everything stateful — back these up on a schedule (`docker run --rm -v
thillai-martial-arts_mysql_data:/data -v $(pwd):/backup alpine tar czf
/backup/mysql-backup.tar.gz /data` is a quick one-off example).

---

## 3. Option B — Separate managed services

For a more scalable setup:

| Component | Suggested service |
|---|---|
| Frontend | Vercel, Netlify, or Cloudflare Pages (static build from `frontend/dist`) |
| Backend | A container platform (AWS ECS/Fargate, Google Cloud Run, Render, Railway) running `backend/Dockerfile` |
| Database | A managed MySQL (AWS RDS, Google Cloud SQL, PlanetScale) |
| File storage | S3 / GCS bucket — swap `FileStorageService`'s disk I/O for the relevant SDK |
| Email | Keep Gmail SMTP for low volume, or move to a transactional provider (SendGrid, SES) for higher volume |

Build the frontend with the production API URL baked in:

```bash
cd frontend
VITE_API_URL=https://api.thillaimartialarts.com \
VITE_RAZORPAY_KEY_ID=rzp_live_xxxx \
npm run build
# deploy the resulting dist/ folder
```

Run the backend as a standard Spring Boot jar or container, supplying all
`${VAR}` environment variables referenced in `application.properties`.

---

## 4. Razorpay go-live

1. Complete Razorpay's KYC/activation flow for the business account.
2. Replace test keys (`rzp_test_…`) with live keys (`rzp_live_…`) in both:
   - Backend: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - Frontend: `VITE_RAZORPAY_KEY_ID`
3. Test a real ₹1 transaction end-to-end before announcing go-live.
4. Razorpay webhooks are not wired up in this codebase (signature
   verification happens synchronously on the success callback instead) —
   add a `/api/payments/webhook` endpoint if you want server-side
   confirmation independent of the browser completing the redirect.

---

## 5. Post-deployment smoke test

- [ ] Load the homepage, confirm the hero video/fallback renders
- [ ] Submit the Contact form, confirm both the admin notification and the
      user's acknowledgement email arrive
- [ ] Complete a real (or ₹1 test-mode) registration end-to-end, confirm the
      Student ID, ID card, and confirmation emails all generate correctly
- [ ] Log into the Student Portal with the new Student ID
- [ ] Log into the Admin Panel, confirm the new student appears in the
      dashboard stats and Students table
- [ ] Download a students Excel export and a payments PDF report

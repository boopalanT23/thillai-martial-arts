# 🥋 THILLAI MARTIAL ARTS CLUB — Management System

A full-stack enterprise web application for THILLAI MARTIAL ARTS CLUB, Chidambaram —
20+ years of martial arts training, now with a modern student registration,
payments, and admin management platform.

**Theme:** Black · Gold · White · Premium academy aesthetic, inspired by
[knockoutfightclub.com](https://knockoutfightclub.com/)

---

## Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React 18, React Router DOM, Tailwind CSS, Material UI, Framer Motion, Axios |
| Backend      | Java 17, Spring Boot 3.3, Spring Security, JWT, REST, springdoc-openapi (Swagger) |
| Database     | MySQL 8 |
| Payments     | Razorpay (Orders API + signature verification) |
| Email        | Spring Mail (JavaMailSender, Gmail SMTP example) |
| Maps         | Google Maps (no-key iframe embed by default; swappable for `@react-google-maps/api`) |
| Files        | Local disk storage (photos, Aadhaar PDFs, gallery, trainer images) — swappable for S3 |
| QR / PDF     | ZXing (QR codes), iText (PDF invoices/reports), Apache POI (Excel exports) |

---

## Project Structure

```
thillai-martial-arts/
├── frontend/                  React + Vite SPA
│   ├── src/
│   │   ├── pages/             14 routed pages (Home, Mission, Training, CourseDetail,
│   │   │                      Gallery, Location, Contact, Registration, MonthlyFees,
│   │   │                      StudentLogin, StudentDashboard, AdminLogin, AdminPanel, NotFound)
│   │   ├── components/        Navbar, Hero, Footer, Achievements, ClassTimings,
│   │   │                      Trainers, IDCardGenerator, route guards
│   │   ├── data/               Static course/batch/gallery catalogues (mirrors backend seed data)
│   │   ├── services/api.js     Single Axios client — the full REST contract lives here
│   │   └── context/AuthContext.jsx
│   └── public/images, /videos  Drop real media here (see public/images/README.md)
│
├── backend/                   Spring Boot REST API
│   └── src/main/java/com/thillai/martialarts/
│       ├── entity/             13 JPA entities + 4 enums
│       ├── repository/         Spring Data JPA repositories
│       ├── service/            18 services (business logic)
│       ├── controller/         12 REST controllers
│       ├── security/           JWT filter, util, UserDetailsService
│       ├── config/              Security, Swagger, CORS, static files, Razorpay, data seeding
│       ├── dto/                request/response/
│       └── exception/          Centralized error handling
│
├── database/
│   ├── schema.sql              Reference SQL (Hibernate auto-creates this; see note inside)
│   ├── er-diagram.png          Entity-relationship diagram
│   └── er-diagram.mmd          Mermaid source for the diagram
│
├── docker-compose.yml          MySQL + backend + frontend, one command
└── .env.example                Copy to .env before running docker compose
```

---

## Quick Start — Docker (recommended)

```bash
cp .env.example .env
# edit .env: set JWT_SECRET, ADMIN_PASSWORD, Razorpay keys, mail credentials

docker compose up --build
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:8080
- Swagger UI → http://localhost:8080/swagger-ui.html

A default admin user is seeded automatically from `ADMIN_USERNAME` / `ADMIN_PASSWORD`
in `.env` (defaults to `admin` / whatever you set — **no default password ships
in code**, you must set one).

---

## Quick Start — Manual / Local Development

### Backend

```bash
cd backend
cp src/main/resources/application.properties src/main/resources/application-local.properties
# edit application-local.properties with your local MySQL creds, Razorpay test keys, etc.

# Create the database (or let ddl-auto=update create it on first run)
mysql -u root -p -e "CREATE DATABASE thillai_martial_arts"

mvn spring-boot:run -Dspring-boot.run.profiles=local
```
The backend starts on `:8080` and seeds batches, courses, trainers, affiliations,
and the default admin account on first boot (see `DataInitializer.java`).

### Frontend

```bash
cd frontend
cp .env.example .env
# set VITE_API_URL=http://localhost:8080 and your Razorpay test key

npm install
npm run dev
```
The frontend starts on **http://localhost:3000** (configured in `vite.config.js`,
which also proxies `/api/*` calls straight to `localhost:8080` in dev mode).

---

## Environment Variables

See `frontend/.env.example` and the `${VAR:default}` placeholders throughout
`backend/src/main/resources/application.properties` for the full list. The
essentials:

| Variable | Where | Purpose |
|---|---|---|
| `JWT_SECRET` | backend | Signs/verifies login tokens — **must** be changed in production |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | backend + frontend | Payment processing |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | backend | Gmail SMTP (use an **App Password**, not your real password) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | backend | Bootstrap admin account, created once on first run |
| `VITE_API_URL` | frontend | Points the SPA at the backend |
| `GOOGLE_MAPS_API_KEY` | optional | Only needed if you switch Location.jsx from the no-key iframe to the JS SDK |

---

## Default Admin Login

After first boot, sign in at `/admin-login` with the credentials you set in
`ADMIN_USERNAME` / `ADMIN_PASSWORD`. **Change this password immediately** in
any environment beyond local development — `DataInitializer.java` only seeds
it once and never resets it on restart.

Students never set a password — they log in passwordlessly with their
**Student ID** (e.g. `TMA0001`) or **registered mobile number**, issued
automatically at the end of registration.

---

## API Documentation

Full interactive API docs (request/response shapes, try-it-out) are served by
springdoc-openapi once the backend is running:

**http://localhost:8080/swagger-ui.html**

The frontend's `src/services/api.js` is the single source of truth for every
endpoint the SPA calls — cross-reference it against the controllers in
`backend/.../controller/` if you're extending either side.

---

## Feature Coverage

✅ **Fully implemented:**
- Public site: Home, Mission, Training catalogue + 9 individual course detail pages, Gallery (filter/search/lightbox), Location (map + directions), Contact form (with email notifications)
- Registration: multi-course selection, live fee calculation, Aadhaar/photo upload, Razorpay checkout, automatic Student ID + digital QR ID card generation
- Student portal: passwordless login, profile, ID card (print/PDF download), fee status, payment history + invoice download, course details, attendance view, notifications
- Admin panel: dashboard analytics (revenue trend, enrollment by batch), student management + Excel/PDF export, course/batch catalogues, gallery upload/delete, trainer management, fee/payment ledger, contact inbox, reports
- Security: JWT auth, BCrypt password hashing, role-based access (`ADMIN` / `STUDENT`), CORS, centralized exception handling
- Razorpay: order creation, signature verification (server-side, never trusts the client), receipt emails

🚧 **Scaffolded / extend-as-you-grow** (functional but intentionally minimal — noted in code comments):
- Attendance reporting is single-day lookup; extend `AttendanceRepository` with a date-range query for full monthly calendars
- A student enrolled in courses spanning multiple batches displays their *first* course's batch as primary on the ID card — see the comment in `StudentService.register()`
- File storage is local disk (`FileStorageService`) — swap for S3/GCS in production by changing this one class
- Google Maps uses a no-API-key iframe embed; swap for `@react-google-maps/api` if you need custom markers/styling

---

## Security Notes for Production

1. **Change `JWT_SECRET` and `ADMIN_PASSWORD`** — never deploy with the example values.
2. **`spring.jpa.hibernate.ddl-auto=update`** is fine for development; switch to a
   migration tool (Flyway/Liquibase) for production schema changes.
3. The public `/api/students/search` endpoint (used by the Monthly Fees page) returns
   student details by Student ID or mobile number **without authentication**, by design
   per the spec. Consider adding rate limiting or a CAPTCHA in front of it in production.
4. Razorpay payments are verified server-side via HMAC-SHA256 signature
   (`RazorpayService.verifySignature`) — the frontend's reported "success" is never
   trusted on its own.
5. `/api/students/{id}`, `/api/students/{studentId}/attendance` and `/id-card`
   currently require only *any* authenticated user (not strictly the matching
   student) — add an ownership check comparing the JWT principal against the
   path's identifier (or restrict to `ROLE_ADMIN` + self) before production launch.

---

## License

Proprietary — built for THILLAI MARTIAL ARTS CLUB, Chidambaram.

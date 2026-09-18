-- ═══════════════════════════════════════════════════════════════
-- THILLAI MARTIAL ARTS CLUB — Reference Database Schema
-- ═══════════════════════════════════════════════════════════════
-- This file is a human-readable REFERENCE of the schema Hibernate
-- generates automatically via `spring.jpa.hibernate.ddl-auto=update`
-- (see backend/src/main/resources/application.properties).
--
-- You do NOT need to run this manually — simply starting the Spring
-- Boot app against an empty `thillai_martial_arts` MySQL database
-- will create every table below, and DataInitializer.java will seed
-- batches, courses, trainers, affiliations and the default admin user.
--
-- This file is useful for: onboarding new developers, writing
-- manual reports/BI queries, or recreating the schema on a DB
-- engine where ddl-auto isn't desired (e.g. a hardened production
-- setup using a separate migration tool such as Flyway/Liquibase).
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS thillai_martial_arts
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thillai_martial_arts;

-- ── Identity & Access ────────────────────────────────────────────

CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(150) UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL,              -- ADMIN | STUDENT
    enabled         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      DATETIME     NOT NULL
);

-- ── Catalogue ────────────────────────────────────────────────────

CREATE TABLE batches (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL UNIQUE,
    days            VARCHAR(100) NOT NULL,
    time            VARCHAR(50)  NOT NULL,
    description     VARCHAR(500)
);

CREATE TABLE courses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug            VARCHAR(80)  NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    category        VARCHAR(40)  NOT NULL,               -- martial-arts | wellness | skill | language
    fee_per_month   INT          NOT NULL,
    batch_id        BIGINT,
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);

-- ── Students ─────────────────────────────────────────────────────

CREATE TABLE students (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id          VARCHAR(20)  NOT NULL UNIQUE,     -- e.g. TMA0001
    name                VARCHAR(120) NOT NULL,
    age                 INT,
    dob                 DATE,
    mobile              VARCHAR(15)  NOT NULL UNIQUE,
    photo_url           VARCHAR(255),
    aadhaar_pdf_url     VARCHAR(255),
    joining_date        DATE,
    reason_for_joining  VARCHAR(500),
    batch_id            BIGINT,
    user_id             BIGINT UNIQUE,
    monthly_fee         INT NOT NULL DEFAULT 0,
    created_at          DATETIME NOT NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE student_courses (                            -- many-to-many join table
    student_id      BIGINT NOT NULL,
    course_id       BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id)  REFERENCES courses(id)
);

-- ── Payments & Registration ──────────────────────────────────────

CREATE TABLE payments (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id            BIGINT NOT NULL,
    amount                INT NOT NULL,
    currency              VARCHAR(10) NOT NULL DEFAULT 'INR',
    razorpay_order_id     VARCHAR(100),
    razorpay_payment_id   VARCHAR(100),
    razorpay_signature    VARCHAR(255),
    status                VARCHAR(20) NOT NULL,           -- CREATED | SUCCESS | FAILED
    type                  VARCHAR(20) NOT NULL,           -- REGISTRATION | MONTHLY_FEE
    for_month             VARCHAR(7),                     -- e.g. 2026-06
    invoice_number        VARCHAR(30) NOT NULL UNIQUE,
    paid_at               DATETIME,
    created_at            DATETIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE registrations (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id          BIGINT NOT NULL,
    courses_snapshot    VARCHAR(500),
    total_fee           INT NOT NULL,
    payment_id          BIGINT UNIQUE,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at          DATETIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (payment_id) REFERENCES payments(id)
);

CREATE TABLE student_id_cards (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id      BIGINT NOT NULL UNIQUE,
    qr_code_data    VARCHAR(500),
    pdf_url         VARCHAR(255),
    issued_date     DATE,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- ── Attendance ───────────────────────────────────────────────────

CREATE TABLE attendance (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id        BIGINT NOT NULL,
    batch_id          BIGINT,
    attendance_date   DATE NOT NULL,
    status            VARCHAR(10) NOT NULL,               -- PRESENT | ABSENT
    marked_by         VARCHAR(100),
    UNIQUE KEY uq_student_date (student_id, attendance_date),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (batch_id)   REFERENCES batches(id)
);

-- ── Content & Site Management ────────────────────────────────────

CREATE TABLE gallery (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    category        VARCHAR(40)  NOT NULL,                -- competitions | training | championships
                                                            -- | events | yoga | fitness | celebrations
    image_url       VARCHAR(255) NOT NULL,
    uploaded_at     DATETIME NOT NULL
);

CREATE TABLE trainers (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    designation     VARCHAR(150) NOT NULL,
    image_url       VARCHAR(255),
    display_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE trainer_qualifications (                      -- @ElementCollection
    trainer_id      BIGINT NOT NULL,
    qualification   VARCHAR(150),
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
);

CREATE TABLE affiliations (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    logo_url        VARCHAR(255),
    display_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE contact_messages (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    phone           VARCHAR(15)  NOT NULL,
    email           VARCHAR(150) NOT NULL,
    city            VARCHAR(80)  NOT NULL,
    state           VARCHAR(80)  NOT NULL,
    message         VARCHAR(1000) NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      DATETIME NOT NULL
);

CREATE TABLE notifications (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id      BIGINT,                                -- NULL = broadcast to all students
    title           VARCHAR(150) NOT NULL,
    message         VARCHAR(500) NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      DATETIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE site_settings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    instagram_url   VARCHAR(255),
    facebook_url    VARCHAR(255),
    youtube_url     VARCHAR(255),
    logo_url        VARCHAR(255)
);

-- ═══════════════════════════════════════════════════════════════
-- Entity-Relationship summary
-- ═══════════════════════════════════════════════════════════════
--   users (1) ───── (1) students
--   batches (1) ─── (*) courses
--   batches (1) ─── (*) students        [primary batch, see Student.java note]
--   students (*) ── (*) courses          via student_courses
--   students (1) ─── (*) payments
--   students (1) ─── (*) registrations
--   students (1) ─── (1) student_id_cards
--   students (1) ─── (*) attendance
--   students (1) ─── (*) notifications  [nullable = broadcast]
--   trainers (1) ─── (*) trainer_qualifications
-- ═══════════════════════════════════════════════════════════════

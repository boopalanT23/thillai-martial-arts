# ── Build stage ──────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies separately from source for faster rebuilds
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Runtime stage ────────────────────────────────────────────
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Non-root user for security and uploads directory with full permissions
RUN addgroup --system spring && adduser --system --ingroup spring spring \
    && mkdir -p /app/uploads/photos /app/uploads/aadhaar \
    && chown -R spring:spring /app /app/uploads \
    && chmod -R 777 /app/uploads

COPY --from=build --chown=spring:spring /app/target/thillai-martial-arts.jar app.jar

USER spring:spring

VOLUME /app/uploads
ENV UPLOAD_DIR=/app/uploads

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

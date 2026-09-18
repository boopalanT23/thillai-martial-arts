package com.thillai.martialarts.config;

import com.thillai.martialarts.entity.*;
import com.thillai.martialarts.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

/**
 * Seeds the database with the club's preloaded batches, courses,
 * trainers, affiliations, and a default admin account — runs once
 * on startup and is idempotent (skips entities that already exist).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final TrainerRepository trainerRepository;
    private final AffiliationRepository affiliationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username}")
    private String adminUsername;

    @Value("${app.admin.default-password}")
    private String adminPassword;

    @Value("${app.admin.default-email}")
    private String adminEmail;

    @Value("${app.fee.per-course}")
    private int feePerCourse;

    @Value("${app.upload.base-dir:src/main/resources/static/uploads}")
    private String uploadBaseDir;

    @Override
    public void run(String... args) {
        seedBatches();
        seedCourses();
        seedTrainers();
        seedAffiliations();
        seedAdminUser();
    }

    private void seedBatches() {
        upsertBatch("Martial Arts Batch", "Monday, Wednesday, Friday", "6:30 PM - 9:00 PM", "Taekwondo, Boxing and Silambam under one roof.");
        upsertBatch("Yoga & Wellness Batch", "Tuesday, Thursday, Saturday", "6:30 PM - 9:00 PM", "Yoga and holistic wellness training.");
        upsertBatch("Daily Fitness & Hindi Batch", "Daily (Monday – Saturday)", "6:30 PM - 9:00 PM", "Daily physical fitness conditioning and Hindi language education.");
        upsertBatch("Weekend Chess & English Grammar Batch", "Saturday, Sunday", "Morning / Evening (According to school presence)", "Weekend mental agility with Chess and English Grammar foundations.");
        log.info("Seeded/Synchronized 4 batches");
    }

    private void upsertBatch(String name, String days, String time, String description) {
        batchRepository.findByName(name).ifPresentOrElse(batch -> {
            batch.setDays(days);
            batch.setTime(time);
            batch.setDescription(description);
            batchRepository.save(batch);
        }, () -> {
            batchRepository.save(Batch.builder()
                    .name(name)
                    .days(days)
                    .time(time)
                    .description(description)
                    .build());
        });
    }

    private void seedCourses() {
        Batch martialArts = batchRepository.findByName("Martial Arts Batch").orElse(null);
        Batch yogaWellness = batchRepository.findByName("Yoga & Wellness Batch").orElse(null);
        Batch dailyFitness = batchRepository.findByName("Daily Fitness & Hindi Batch").orElse(null);
        Batch weekendBatch = batchRepository.findByName("Weekend Chess & English Grammar Batch").orElse(null);

        if (courseRepository.count() == 0) {
            List<Course> courses = List.of(
                    Course.builder().slug("taekwondo").name("Taekwondo").category("martial-arts").feePerMonth(feePerCourse).batch(martialArts).build(),
                    Course.builder().slug("boxing").name("Boxing").category("martial-arts").feePerMonth(feePerCourse).batch(martialArts).build(),
                    Course.builder().slug("silambam").name("Silambam").category("martial-arts").feePerMonth(feePerCourse).batch(martialArts).build(),
                    Course.builder().slug("yoga").name("Yoga").category("wellness").feePerMonth(feePerCourse).batch(yogaWellness).build(),
                    Course.builder().slug("fitness").name("Fitness").category("wellness").feePerMonth(feePerCourse).batch(dailyFitness).build(),
                    Course.builder().slug("guitar").name("Guitar").category("skill").feePerMonth(feePerCourse).batch(yogaWellness).build(),
                    Course.builder().slug("chess").name("Chess").category("skill").feePerMonth(feePerCourse).batch(weekendBatch).build(),
                    Course.builder().slug("hindi").name("Hindi").category("language").feePerMonth(feePerCourse).batch(dailyFitness).build(),
                    Course.builder().slug("english-grammar").name("English Grammar").category("language").feePerMonth(feePerCourse).batch(weekendBatch).build()
            );
            courseRepository.saveAll(courses);
            log.info("Seeded {} courses", courses.size());
        } else {
            updateCourseBatch("taekwondo", martialArts);
            updateCourseBatch("boxing", martialArts);
            updateCourseBatch("silambam", martialArts);
            updateCourseBatch("yoga", yogaWellness);
            updateCourseBatch("guitar", yogaWellness);
            updateCourseBatch("fitness", dailyFitness);
            updateCourseBatch("hindi", dailyFitness);
            updateCourseBatch("chess", weekendBatch);
            updateCourseBatch("english-grammar", weekendBatch);
        }
    }

    private void updateCourseBatch(String slug, Batch batch) {
        if (batch == null) return;
        courseRepository.findBySlug(slug).ifPresent(c -> {
            c.setBatch(batch);
            courseRepository.save(c);
        });
    }

    private void seedTrainers() {
        if (trainerRepository.count() == 0) {
            trainerRepository.save(Trainer.builder()
                    .name("Master R. HariHaran")
                    .designation("Founding Member and Coach")
                    .displayOrder(1)
                    .imageUrl("/images/founder.jpeg")
                    .qualifications(List.of(
                            "MLIS", "MSc Yoga", "MSc Psychology", "Diploma in Taekwondo",
                            "Certified Food Nutrition Specialist", "Black Belt DAN 4", "National Referee",
                            "Hindi Pandit", "President, Cuddalore District Sports Taekwondo Association",
                            "Member, Tamil Nadu Yogasana Association"
                    ))
                    .build());

            trainerRepository.save(Trainer.builder()
                    .name("H. Thillai Nayagi")
                    .designation("National Referee and Coach")
                    .displayOrder(2)
                    .imageUrl("/images/coach.jpeg")
                    .qualifications(List.of())
                    .build());

            trainerRepository.save(Trainer.builder()
                    .name("Mrs. Shanthi Hariharan")
                    .designation("Legal advisor,Thillai MartialArts club")
                    .displayOrder(3)
                    .imageUrl("/images/advisor.jpeg")
                    .qualifications(List.of("B.Com LLB", "Senior Advocate -District court,Chidambaram"))
                    .build());

            log.info("Seeded 3 permanent trainers with photos");
            return;
        }

        // Self-heal existing trainers if imageUrl is null, blank, or points to missing upload files
        List<Trainer> existing = trainerRepository.findAll();
        for (Trainer t : existing) {
            String clean = (t.getName() != null ? t.getName() : "").toLowerCase();
            String des = (t.getDesignation() != null ? t.getDesignation() : "").toLowerCase();
            String currentUrl = t.getImageUrl();

            boolean needsDefault = (currentUrl == null || currentUrl.isBlank());
            if (!needsDefault && currentUrl.startsWith("/uploads/")) {
                try {
                    String subPath = currentUrl.substring("/uploads/".length());
                    Path filePath = Paths.get(uploadBaseDir, subPath);
                    if (!Files.exists(filePath)) {
                        needsDefault = true;
                    }
                } catch (Exception ignored) {
                    needsDefault = true;
                }
            }

            if (needsDefault) {
                if (clean.contains("hariharan") && (clean.contains("master") || clean.contains("r."))) {
                    t.setImageUrl("/images/founder.jpeg");
                    trainerRepository.save(t);
                    log.info("Restored permanent photo for {}", t.getName());
                } else if (clean.contains("thillai") || clean.contains("nayagi")) {
                    t.setImageUrl("/images/coach.jpeg");
                    trainerRepository.save(t);
                    log.info("Restored permanent photo for {}", t.getName());
                } else if (clean.contains("shanthi") || des.contains("legal") || des.contains("advocate")) {
                    t.setImageUrl("/images/advisor.jpeg");
                    trainerRepository.save(t);
                    log.info("Restored permanent photo for {}", t.getName());
                }
            }
        }

        boolean hasShanthi = existing.stream().anyMatch(t -> {
            String clean = (t.getName() != null ? t.getName() : "").toLowerCase();
            String des = (t.getDesignation() != null ? t.getDesignation() : "").toLowerCase();
            return clean.contains("shanthi") || des.contains("legal") || des.contains("advocate");
        });

        if (!hasShanthi) {
            trainerRepository.save(Trainer.builder()
                    .name("Mrs. Shanthi Hariharan")
                    .designation("Legal advisor,Thillai MartialArts club")
                    .displayOrder(3)
                    .imageUrl("/images/advisor.jpeg")
                    .qualifications(List.of("B.Com LLB", "Senior Advocate -District court,Chidambaram"))
                    .build());
            log.info("Seeded missing Legal Advisor (Mrs. Shanthi Hariharan)");
        }
    }

    private void seedAffiliations() {
        if (affiliationRepository.count() > 0) return;

        affiliationRepository.saveAll(List.of(
                Affiliation.builder().name("Cuddalore District Taekwondo Sports Association").displayOrder(1).build(),
                Affiliation.builder().name("Tamil Nadu Taekwondo Association").displayOrder(2).build(),
                Affiliation.builder().name("Fit India").displayOrder(3).build()
        ));
        log.info("Seeded 3 affiliations");
    }

    private void seedAdminUser() {
        Optional<User> existingOpt = userRepository.findByUsernameIgnoreCase(adminUsername);
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();
            existing.setRole(Role.ADMIN);
            existing.setEnabled(true);
            existing.setPassword(passwordEncoder.encode(adminPassword));
            userRepository.save(existing);
            log.info("Ensured/reset default admin user '{}'", adminUsername);
            return;
        }

        User admin = User.builder()
                .username(adminUsername)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);
        log.warn("Seeded default admin user '{}' — default password set to configured default.", adminUsername);
    }
}

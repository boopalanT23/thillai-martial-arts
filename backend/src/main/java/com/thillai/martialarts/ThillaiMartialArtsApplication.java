package com.thillai.martialarts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * THILLAI MARTIAL ARTS CLUB — Management System
 * Entry point for the Spring Boot backend.
 */
@SpringBootApplication(scanBasePackages = "com.thillai.martialarts")
@EnableAsync
public class ThillaiMartialArtsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ThillaiMartialArtsApplication.class, args);
    }
}

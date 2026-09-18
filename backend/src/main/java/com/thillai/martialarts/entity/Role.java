package com.thillai.martialarts.entity;

/**
 * Application roles. Kept as a simple enum (rather than a separate
 * roles table) since every user is unambiguously either an ADMIN or
 * a STUDENT — this keeps JWT claims and @PreAuthorize checks simple.
 */
public enum Role {
    ADMIN,
    STUDENT
}

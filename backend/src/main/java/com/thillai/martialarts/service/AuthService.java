package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.AdminLoginRequest;
import com.thillai.martialarts.dto.request.LoginRequest;
import com.thillai.martialarts.dto.request.StudentLoginRequest;
import com.thillai.martialarts.dto.response.AuthResponse;
import com.thillai.martialarts.entity.Role;
import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.entity.User;
import com.thillai.martialarts.repository.StudentRepository;
import com.thillai.martialarts.repository.UserRepository;
import com.thillai.martialarts.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Unified login authentication for the Academy Portal.
     * Supports both students (by Student ID or registered mobile) and
     * administrators (by username or email) using encrypted passwords.
     */
    @Transactional
    public AuthResponse unifiedLogin(LoginRequest request) {
        String identifier = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        String rawPassword = request.getPassword() != null ? request.getPassword().trim() : "";
        String requestedRole = request.getRole() != null ? request.getRole().trim().toUpperCase() : null;

        if (identifier.isEmpty() || rawPassword.isEmpty()) {
            throw new BadCredentialsException("Identifier and password must not be empty");
        }

        // Case 1: Client explicitly requests ADMIN login
        if ("ADMIN".equals(requestedRole)) {
            return authenticateAdmin(identifier, rawPassword);
        }

        // Case 2: Client explicitly requests STUDENT login
        if ("STUDENT".equals(requestedRole)) {
            return authenticateStudent(identifier, rawPassword);
        }

        // Case 3: AUTO / unspecified role — detect Admin first
        Optional<User> adminUserOpt = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .filter(u -> u.getRole() == Role.ADMIN);

        if (adminUserOpt.isPresent()) {
            User admin = adminUserOpt.get();
            if (!passwordEncoder.matches(rawPassword, admin.getPassword())) {
                throw new BadCredentialsException("Invalid username or password");
            }
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", Role.ADMIN.name());
            String token = jwtUtil.generateToken(admin, claims);
            return AuthResponse.builder()
                    .token(token)
                    .role(Role.ADMIN.name())
                    .name(admin.getUsername())
                    .username(admin.getUsername())
                    .build();
        }

        // Case 4: AUTO / unspecified role — detect Student (by Student ID or Mobile)
        Optional<Student> studentOpt = studentRepository.findByStudentId(identifier)
                .or(() -> studentRepository.findByMobile(identifier));

        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            User user = student.getUser();
            if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
                throw new BadCredentialsException("Invalid Student ID, mobile number, or password");
            }
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", Role.STUDENT.name());
            claims.put("studentId", student.getStudentId());
            String token = jwtUtil.generateToken(user, claims);
            return AuthResponse.builder()
                    .token(token)
                    .role(Role.STUDENT.name())
                    .name(student.getName())
                    .studentId(student.getStudentId())
                    .build();
        }

        throw new BadCredentialsException("Invalid credentials or password. Please try again.");
    }

    /**
     * Student login enforcing BCrypt encrypted password validation.
     */
    @Transactional
    public AuthResponse studentLogin(StudentLoginRequest request) {
        return authenticateStudent(request.getIdentifier().trim(), request.getPassword().trim());
    }

    /**
     * Admin login enforcing BCrypt encrypted password validation.
     */
    @Transactional
    public AuthResponse adminLogin(AdminLoginRequest request) {
        return authenticateAdmin(request.getUsername().trim(), request.getPassword().trim());
    }

    private AuthResponse authenticateStudent(String identifier, String rawPassword) {
        Student student = studentRepository.findByStudentId(identifier)
                .or(() -> studentRepository.findByMobile(identifier))
                .orElseThrow(() -> new BadCredentialsException("Invalid Student ID, mobile number, or password"));

        User user = student.getUser();
        if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid Student ID, mobile number, or password");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", Role.STUDENT.name());
        claims.put("studentId", student.getStudentId());

        String token = jwtUtil.generateToken(user, claims);

        return AuthResponse.builder()
                .token(token)
                .role(Role.STUDENT.name())
                .name(student.getName())
                .studentId(student.getStudentId())
                .build();
    }

    private AuthResponse authenticateAdmin(String identifier, String rawPassword) {
        User admin = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (admin.getRole() != Role.ADMIN) {
            throw new BadCredentialsException("This account does not have admin access");
        }

        if (!passwordEncoder.matches(rawPassword, admin.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", Role.ADMIN.name());

        String token = jwtUtil.generateToken(admin, claims);

        return AuthResponse.builder()
                .token(token)
                .role(Role.ADMIN.name())
                .name(admin.getUsername())
                .username(admin.getUsername())
                .build();
    }
}

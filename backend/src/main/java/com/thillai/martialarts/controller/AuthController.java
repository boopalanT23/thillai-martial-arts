package com.thillai.martialarts.controller;

import com.thillai.martialarts.dto.request.AdminLoginRequest;
import com.thillai.martialarts.dto.request.StudentLoginRequest;
import com.thillai.martialarts.dto.response.AuthResponse;
import com.thillai.martialarts.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") 
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Student and admin login")
public class AuthController {

 

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody com.thillai.martialarts.dto.request.LoginRequest request) {
        return ResponseEntity.ok(authService.unifiedLogin(request));
    }

    @PostMapping("/student-login")
    public ResponseEntity<AuthResponse> studentLogin(@Valid @RequestBody StudentLoginRequest request) {
        return ResponseEntity.ok(authService.studentLogin(request));
    }
//     @PostMapping("/student-login")
// public ResponseEntity<AuthResponse> studentLogin(
//         @Valid @RequestBody StudentLoginRequest request) {

//     System.out.println("==============");
//     System.out.println("Student Login Called");
//     System.out.println(request.getIdentifier());
//     System.out.println("==============");

//     return ResponseEntity.ok(authService.studentLogin(request));
// }

    @PostMapping("/admin-login")
    public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }

      
}

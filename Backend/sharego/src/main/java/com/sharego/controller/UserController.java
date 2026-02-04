package com.sharego.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sharego.dtos.AuthRequest;
import com.sharego.dtos.AuthResp;
import com.sharego.dtos.UserDTO;
import com.sharego.dtos.UserRegisterDTO;
import com.sharego.security.JwtUtil;
import com.sharego.security.UserPrincipal;
import com.sharego.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;

        @PostMapping("/register")
        public ResponseEntity<?> registerUser(
                        @RequestBody @Valid UserRegisterDTO dto) {

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(userService.registerUser(dto));
        }

        @PostMapping("/login")
        public ResponseEntity<AuthResp> login(
                        @RequestBody @Valid AuthRequest request) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

                String token = jwtUtil.generateToken(principal);

                return ResponseEntity.ok(
                                new AuthResp(
                                                token,
                                                "Login successful"));
        }

        @GetMapping
        public List<UserDTO> getAllUsers() {

                return userService.getAllUsers();
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteUser(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                userService.deleteUser(id));
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
                String email = request.get("email");
                return ResponseEntity.ok(userService.generateResetOtp(email));
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
                String email = request.get("email");
                String otp = request.get("otp");
                String newPassword = request.get("newPassword");
                return ResponseEntity.ok(userService.resetPassword(email, otp, newPassword));
        }
}

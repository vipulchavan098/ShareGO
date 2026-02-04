package com.sharego.service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharego.custom_exceptions.InvalidInputException;
import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.UserDTO;
import com.sharego.dtos.UserRegisterDTO;
import com.sharego.entities.User;
import com.sharego.entities.UserRole;
import com.sharego.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl
                implements UserService {

        private final UserRepository userRepository;
        private final ModelMapper modelMapper;
        private final PasswordEncoder passwordEncoder;
        private final EmailService emailService;

        // In-memory OTP storage for simulation
        private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
        private final Random random = new Random();

        @Override
        public ApiResponse registerUser(
                        UserRegisterDTO dto) {

                // Debug log
                System.out.println("Received registration request: " + dto);

                if (userRepository.existsByEmail(dto.getEmail())) {
                        throw new InvalidInputException("Email already exists");
                }

                User user = new User();
                user.setEmail(dto.getEmail());
                user.setPassword(passwordEncoder.encode(dto.getPassword()));

                if (dto.getRole() != null && !dto.getRole().trim().isEmpty()) {
                        try {
                                user.setRole(UserRole.valueOf(dto.getRole().trim().toUpperCase()));
                        } catch (IllegalArgumentException e) {
                                System.err.println("Invalid role: " + dto.getRole());
                                throw new InvalidInputException("Invalid role specified: " + dto.getRole());
                        }
                } else {
                        user.setRole(UserRole.PASSENGER);
                }

                User saved = userRepository.save(user);

                return new ApiResponse(
                                "User registered with ID "
                                                + saved.getId(),
                                "SUCCESS");
        }

        @Override
        public List<UserDTO> getAllUsers() {

                return userRepository
                                .findAll()
                                .stream()
                                .map(u -> {

                                        UserDTO dto = modelMapper.map(
                                                        u,
                                                        UserDTO.class);

                                        dto.setUserId(
                                                        u.getId());

                                        dto.setRole(
                                                        u.getRole().name());

                                        return dto;
                                })
                                .toList();
        }

        @Override
        public ApiResponse deleteUser(
                        Long userId) {

                User user = userRepository
                                .findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                userRepository.delete(user);

                return new ApiResponse(
                                "User deleted",
                                "SUCCESS");
        }

        @Override
        public ApiResponse generateResetOtp(String email) {
                // DEBUG LOG
                System.out.println("Checking existence for email: '" + email + "'");

                if (!userRepository.existsByEmail(email)) {
                        System.out.println("Email NOT found in DB: '" + email + "'");
                        throw new ResourceNotFoundException("User not found with email: " + email);
                }

                // Generate 6 digit OTP
                String otp = String.format("%06d", random.nextInt(999999));

                // Store OTP
                otpStorage.put(email, otp);

                // SIMULATION: Log to console
                System.out.println("==========================================");
                System.out.println("FORGOT PASSWORD SIMULATION");
                System.out.println("OTP for " + email + ": " + otp);
                System.out.println("==========================================");

                // Send Real Email
                emailService.sendSimpleEmail(email, "ShareGo - Password Reset OTP",
                                "Your OTP for password reset is: " + otp);

                return new ApiResponse("OTP has been sent to your email.", "SUCCESS");
        }

        @Override
        public ApiResponse resetPassword(String email, String otp, String newPassword) {
                if (!otpStorage.containsKey(email)) {
                        throw new InvalidInputException("No OTP request found for this email");
                }

                String storedOtp = otpStorage.get(email);
                if (!storedOtp.equals(otp)) {
                        throw new InvalidInputException("Invalid OTP");
                }

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);

                // Clear OTP
                otpStorage.remove(email);

                return new ApiResponse("Password reset successfully", "SUCCESS");
        }
}

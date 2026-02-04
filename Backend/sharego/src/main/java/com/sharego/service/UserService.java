package com.sharego.service;

import java.util.List;

import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.UserDTO;
import com.sharego.dtos.UserRegisterDTO;

public interface UserService {

    ApiResponse registerUser(UserRegisterDTO dto);

    List<UserDTO> getAllUsers();

    ApiResponse deleteUser(Long userId);

    ApiResponse generateResetOtp(String email);

    ApiResponse resetPassword(String email, String otp, String newPassword);
}

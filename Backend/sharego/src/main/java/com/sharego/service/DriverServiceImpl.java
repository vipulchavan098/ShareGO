package com.sharego.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharego.custom_exceptions.InvalidInputException;
import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.DriverRegDTO;
import com.sharego.dtos.DriverRespDTO;
import com.sharego.entities.Driver;
import com.sharego.entities.User;
import com.sharego.entities.UserRole;
import com.sharego.repositories.DriverRepository;
import com.sharego.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

        private final DriverRepository driverRepository;
        private final UserRepository userRepository;
        private final ModelMapper modelMapper;

        @Override
        public ApiResponse registerDriver(DriverRegDTO dto) {

                User user = userRepository.findById(dto.getUserId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid user id"));

                if (user.getRole() != UserRole.DRIVER) {
                        throw new InvalidInputException(
                                        "User is not a DRIVER");
                }

                Driver driver = modelMapper.map(dto, Driver.class);

                driver.setUser(user);

                Driver saved = driverRepository.save(driver);

                return new ApiResponse(
                                "Driver registered with id = "
                                                + saved.getId(),
                                "SUCCESS");
        }

        @Override
        public DriverRespDTO getDriverByUserId(
                        Long userId) {

                Driver driver = driverRepository.findByUserId(userId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Driver not found"));

                DriverRespDTO dto = modelMapper.map(
                                driver,
                                DriverRespDTO.class);
                dto.setDriverId(driver.getId());

                return dto;
        }

        @Override
        public DriverRespDTO updateDriver(Long driverId, DriverRegDTO dto) {
                Driver driver = driverRepository.findById(driverId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

                driver.setLicenseNo(dto.getLicenseNo());
                driver.setExperience(dto.getExperience());
                // Update other fields if needed, e.g. phone
                if (dto.getPhone() != null) {
                        driver.setPhone(dto.getPhone());
                }

                try {
                        Driver saved = driverRepository.save(driver);
                        DriverRespDTO resp = modelMapper.map(saved, DriverRespDTO.class);
                        resp.setDriverId(saved.getId());
                        return resp;
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                        throw new InvalidInputException("License Number already exists. Please check your details.");
                }
        }
}

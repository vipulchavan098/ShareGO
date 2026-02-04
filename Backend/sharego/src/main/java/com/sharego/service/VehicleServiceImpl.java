package com.sharego.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.VehicleDTO;
import com.sharego.entities.Driver;
import com.sharego.entities.Vehicle;
import com.sharego.repositories.DriverRepository;
import com.sharego.repositories.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class VehicleServiceImpl
        implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse addVehicle(
            VehicleDTO dto) {

        Driver driver =
                driverRepository.findById(
                        dto.getDriverId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invalid driver id"));

        Vehicle vehicle =
                modelMapper.map(
                        dto,
                        Vehicle.class);

        vehicle.setDriver(driver);

        Vehicle saved =
                vehicleRepository.save(vehicle);

        return new ApiResponse(
                "Vehicle added with ID "
                        + saved.getId(),
                "SUCCESS");
    }

    @Override
    public List<VehicleDTO> getDriverVehicles(
            Long driverId) {

        return vehicleRepository
                .findByDriverId(driverId)
                .stream()
                .map(v -> {
                    VehicleDTO dto =
                            modelMapper.map(
                                    v,
                                    VehicleDTO.class);

                    dto.setVehicleId(
                            v.getId());

                    return dto;
                })
                .toList();
    }
}

package com.sharego.service;

import java.util.List;

import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.VehicleDTO;

public interface VehicleService {

    ApiResponse addVehicle(VehicleDTO dto);

    List<VehicleDTO> getDriverVehicles(Long driverId);
}

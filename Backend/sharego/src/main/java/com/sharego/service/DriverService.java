package com.sharego.service;

import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.DriverRegDTO;
import com.sharego.dtos.DriverRespDTO;

public interface DriverService {

    ApiResponse registerDriver(DriverRegDTO dto);

    DriverRespDTO getDriverByUserId(Long userId);

    DriverRespDTO updateDriver(Long driverId, DriverRegDTO dto);
}

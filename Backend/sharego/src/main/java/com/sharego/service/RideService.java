package com.sharego.service;

import java.time.LocalDate;
import java.util.List;

import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.CreateRideDTO;
import com.sharego.dtos.RideDTO;
import com.sharego.dtos.UpdateRideStatusDTO;

public interface RideService {

    ApiResponse createRide(CreateRideDTO dto);

    List<RideDTO> searchRides(String source, String destination, LocalDate rideDate);

    ApiResponse cancelRide(Long rideId, Long driverId);

    ApiResponse updateRideStatus(UpdateRideStatusDTO dto);
}

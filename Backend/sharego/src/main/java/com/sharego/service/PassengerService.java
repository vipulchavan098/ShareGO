package com.sharego.service;

import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.PassengerDTO;

public interface PassengerService {

    ApiResponse registerPassenger(PassengerDTO dto);

    PassengerDTO getPassengerByUserId(Long userId);
}

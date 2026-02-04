package com.sharego.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.PassengerDTO;
import com.sharego.entities.Passenger;
import com.sharego.entities.User;
import com.sharego.repositories.PassengerRepository;
import com.sharego.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PassengerServiceImpl
        implements PassengerService {

    private final PassengerRepository passengerRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse registerPassenger(
            PassengerDTO dto) {

        Passenger passenger =
                modelMapper.map(
                        dto,
                        Passenger.class);

        User user =
                userRepository.findById(
                        dto.getUserId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invalid user id"));

        passenger.setUser(user);

        Passenger saved =
                passengerRepository.save(passenger);

        return new ApiResponse(
                "Passenger registered with ID "
                        + saved.getId(),
                "SUCCESS");
    }

    @Override
    public PassengerDTO getPassengerByUserId(
            Long userId) {

        Passenger passenger =
                passengerRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Passenger not found"));

        PassengerDTO dto =
                modelMapper.map(
                        passenger,
                        PassengerDTO.class);

        dto.setPassengerId(
                passenger.getId());

        dto.setUserId(
                passenger.getUser().getId());

        return dto;
    }
}

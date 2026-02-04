package com.sharego.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharego.dtos.PassengerDTO;
import com.sharego.service.PassengerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService passengerService;

    @PostMapping("/register")
    public ResponseEntity<?> registerPassenger(
            @RequestBody @Valid PassengerDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(passengerService
                        .registerPassenger(dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPassengerByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                passengerService
                        .getPassengerByUserId(userId));
    }
}

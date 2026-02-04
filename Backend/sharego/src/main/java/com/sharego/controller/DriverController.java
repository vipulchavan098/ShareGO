package com.sharego.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharego.dtos.DriverRegDTO;
import com.sharego.dtos.DriverRespDTO;
import com.sharego.service.DriverService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping("/register")
    public ResponseEntity<?> registerDriver(
            @RequestBody @Valid DriverRegDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(driverService.registerDriver(dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DriverRespDTO> getDriverByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                driverService.getDriverByUserId(userId));
    }

    @PutMapping("/{driverId}")
    public ResponseEntity<?> updateDriver(
            @PathVariable Long driverId,
            @RequestBody @Valid DriverRegDTO dto) {

        return ResponseEntity.ok(
                driverService.updateDriver(driverId, dto));
    }
}

package com.sharego.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharego.dtos.VehicleDTO;
import com.sharego.service.VehicleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

        private final VehicleService vehicleService;

        @PostMapping
        public ResponseEntity<?> addVehicle(
                        @RequestBody @Valid VehicleDTO dto) {

                System.out.println("Received add vehicle request: " + dto);
                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(vehicleService
                                                .addVehicle(dto));
        }

        @GetMapping("/driver/{driverId}")
        public List<VehicleDTO> getDriverVehicles(
                        @PathVariable Long driverId) {

                return vehicleService
                                .getDriverVehicles(driverId);
        }
}

package com.sharego.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharego.dtos.CreateRideDTO;
import com.sharego.dtos.RideDTO;
import com.sharego.dtos.UpdateRideStatusDTO;
import com.sharego.service.RideService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rides")
@RequiredArgsConstructor
public class RideController {

        private final RideService rideService;

        @PostMapping
        public ResponseEntity<?> createRide(
                        @RequestBody @Valid CreateRideDTO dto) {

                return ResponseEntity.ok(
                                rideService.createRide(dto));
        }

        @GetMapping("/search")
        public List<RideDTO> searchRides(
                        @RequestParam String source,
                        @RequestParam String destination,
                        @RequestParam(required = false) LocalDate rideDate) {

                return rideService.searchRides(
                                source,
                                destination,
                                rideDate);
        }

        @PutMapping("/cancel/{rideId}/driver/{driverId}")
        public ResponseEntity<?> cancelRide(
                        @PathVariable Long rideId,
                        @PathVariable Long driverId) {

                return ResponseEntity.ok(
                                rideService.cancelRide(
                                                rideId,
                                                driverId));
        }

        @PutMapping("/status")
        public ResponseEntity<?> updateStatus(
                        @RequestBody @Valid UpdateRideStatusDTO dto) {

                return ResponseEntity.ok(
                                rideService.updateRideStatus(dto));
        }
}

package com.sharego.service;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharego.custom_exceptions.InvalidInputException;
import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.CreateRideDTO;
import com.sharego.dtos.RideDTO;
import com.sharego.dtos.UpdateRideStatusDTO;
import com.sharego.entities.Driver;
import com.sharego.entities.Ride;
import com.sharego.entities.RideStatus;
import com.sharego.entities.Vehicle;
import com.sharego.repositories.DriverRepository;
import com.sharego.repositories.RideRepository;
import com.sharego.repositories.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RideServiceImpl
                implements RideService {

        private final RideRepository rideRepository;
        private final DriverRepository driverRepository;
        private final VehicleRepository vehicleRepository;
        private final ModelMapper modelMapper;

        @Override
        public ApiResponse createRide(
                        CreateRideDTO dto) {

                Driver driver = driverRepository.findById(
                                dto.getDriverId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid driver ID"));

                Vehicle vehicle = vehicleRepository.findById(
                                dto.getVehicleId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid vehicle ID"));

                if (!vehicle.getDriver()
                                .getId()
                                .equals(driver.getId())) {

                        throw new InvalidInputException(
                                        "Vehicle does not belong to driver");
                }

                Ride ride = modelMapper.map(dto, Ride.class);

                ride.setDriver(driver);
                ride.setVehicle(vehicle);
                ride.setStatus(
                                RideStatus.SCHEDULED);

                Ride savedRide = rideRepository.save(ride);

                return new ApiResponse(
                                "Ride created with ID "
                                                + savedRide.getId(),
                                "SUCCESS");
        }

        @Override
        public List<RideDTO> searchRides(
                        String source,
                        String destination,
                        LocalDate rideDate) {

                List<Ride> rides;
                if (rideDate != null) {
                        System.out.println("Searching for rides: " + source + " -> " + destination + " on " + rideDate);
                        rides = rideRepository.searchRides(source, destination, rideDate.toString());
                } else {
                        rides = rideRepository
                                        .findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCase(
                                                        source,
                                                        destination);
                }

                return rides.stream()
                                .map(r -> new RideDTO(
                                                r.getId(),
                                                r.getSource(),
                                                r.getDestination(),
                                                r.getRideDate(),
                                                r.getRideTime(),
                                                r.getPricePerSeat()))
                                .toList();
        }

        @Override
        public ApiResponse cancelRide(
                        Long rideId,
                        Long driverId) {

                Ride ride = rideRepository.findById(rideId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid ride ID"));

                if (!ride.getDriver()
                                .getId()
                                .equals(driverId)) {

                        throw new InvalidInputException(
                                        "Driver not authorized");
                }

                if (ride.getStatus() != RideStatus.SCHEDULED) {

                        throw new InvalidInputException(
                                        "Ride cannot be cancelled");
                }

                ride.setStatus(
                                RideStatus.CANCELLED);

                return new ApiResponse(
                                "Ride cancelled",
                                "SUCCESS");
        }

        @Override
        public ApiResponse updateRideStatus(
                        UpdateRideStatusDTO dto) {

                Ride ride = rideRepository.findById(
                                dto.getRideId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid ride ID"));

                ride.setStatus(
                                dto.getStatus());

                return new ApiResponse(
                                "Ride status updated",
                                "SUCCESS");
        }
}

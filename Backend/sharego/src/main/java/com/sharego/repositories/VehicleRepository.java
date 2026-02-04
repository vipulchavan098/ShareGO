package com.sharego.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharego.entities.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByDriverId(Long driverId);
}

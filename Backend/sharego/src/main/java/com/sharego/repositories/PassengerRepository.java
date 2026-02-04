package com.sharego.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharego.entities.Passenger;

public interface PassengerRepository extends JpaRepository<Passenger, Long> {

    Optional<Passenger> findByUserId(Long userId);
}

package com.sharego.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharego.entities.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByUserId(Long userId);
}

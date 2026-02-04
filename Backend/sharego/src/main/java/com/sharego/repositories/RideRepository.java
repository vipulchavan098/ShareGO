package com.sharego.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sharego.dtos.RideDTO;
import com.sharego.entities.Ride;
import com.sharego.entities.RideStatus;

public interface RideRepository extends JpaRepository<Ride, Long> {

        // Search rides by source & destination (Case Insensitive, Partial Match)
        List<Ride> findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCase(String source,
                        String destination);

        // Search rides by source, destination & date with explicit JPQL
        @Query("SELECT r FROM Ride r WHERE " +
                        "LOWER(r.source) LIKE LOWER(CONCAT('%', :source, '%')) AND " +
                        "LOWER(r.destination) LIKE LOWER(CONCAT('%', :destination, '%')) AND " +
                        "r.rideDate = :rideDate AND r.status = 'SCHEDULED'")
        List<Ride> searchRides(@Param("source") String source,
                        @Param("destination") String destination,
                        @Param("rideDate") String rideDate);

        // DTO projection
        @Query("""
                        select new com.sharego.dtos.RideDTO
                        (r.id, r.source, r.destination, r.rideDate, r.rideTime, r.pricePerSeat)
                        from Ride r
                        where r.status = :status
                        """)
        List<RideDTO> getAllRidesByStatus(@Param("status") RideStatus status);
}

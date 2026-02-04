package com.sharego.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sharego.dtos.BookingDTO;
import com.sharego.entities.Booking;
import com.sharego.entities.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

        List<Booking> findByPassengerId(Long passengerId);

        List<Booking> findByRideId(Long rideId);

        @Query("""
                        select new com.sharego.dtos.BookingDTO
                        (b.id, b.seats, b.bookingStatus,
                         concat(p.firstName,' ',p.lastName))
                        from Booking b
                        join b.passenger p
                        where b.bookingStatus = :status
                        """)
        List<BookingDTO> getBookingsByStatus(@Param("status") BookingStatus status);

        @Query("""
                        select new com.sharego.dtos.BookingDTO
                        (b.id, b.seats, b.bookingStatus,
                         concat(p.firstName,' ',p.lastName),
                         r.id, r.source, r.destination, r.rideDate, r.rideTime,
                         (b.seats * r.pricePerSeat))
                        from Booking b
                        join b.passenger p
                        join b.ride r
                        join r.driver d
                        where d.id = :driverId
                        """)
        List<BookingDTO> getDriverBookings(@Param("driverId") Long driverId);
}

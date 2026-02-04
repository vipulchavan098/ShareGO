package com.sharego.dtos;

import com.sharego.entities.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {

    private Long bookingId;
    private int seats;
    private BookingStatus bookingStatus;
    private String passengerName;

    // Explicit constructor for JPQL query in BookingRepository
    public BookingDTO(Long bookingId, int seats, BookingStatus bookingStatus, String passengerName) {
        this.bookingId = bookingId;
        this.seats = seats;
        this.bookingStatus = bookingStatus;
        this.passengerName = passengerName;
    }

    // New fields for Dashboard
    private Long rideId;
    private String rideSource;
    private String rideDestination;
    private String rideDate;
    private String rideTime;
    private double totalFare;
}

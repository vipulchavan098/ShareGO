package com.sharego.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "bookings")

@AttributeOverride(name = "id", column = @Column(name = "booking_id"))

@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = { "ride", "passenger" })
public class Booking extends BaseEntity {

    private int seats;

    @Enumerated(EnumType.STRING)
    @Column(name = "b_status", length = 20)
    private BookingStatus bookingStatus;

    // Many Bookings ----> One Ride
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    // Many Bookings ----> One Passenger
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    public Booking(int seats, BookingStatus bookingStatus) {
        super();
        this.seats = seats;
        this.bookingStatus = bookingStatus;
    }
}

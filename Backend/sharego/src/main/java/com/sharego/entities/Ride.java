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
@Table(name = "rides")

@AttributeOverride(name = "id", column = @Column(name = "ride_id"))

@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"driver","vehicle"})
public class Ride extends BaseEntity {

    @Column(length = 50, nullable = false)
    private String source;

    @Column(length = 50, nullable = false)
    private String destination;

    @Column(name = "ride_date", length = 15)
    private String rideDate;

    @Column(name = "ride_time", length = 10)
    private String rideTime;

    @Column(name = "available_seats")
    private int availableSeats;

    @Column(name = "price_per_seat")
    private double pricePerSeat;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RideStatus status;

    // Many Rides ----> One Driver
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    // Many Rides ----> One Vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    public Ride(String source, String destination, String rideDate,
                String rideTime, int availableSeats, double pricePerSeat,
                RideStatus status) {
        super();
        this.source = source;
        this.destination = destination;
        this.rideDate = rideDate;
        this.rideTime = rideTime;
        this.availableSeats = availableSeats;
        this.pricePerSeat = pricePerSeat;
        this.status = status;
    }
}

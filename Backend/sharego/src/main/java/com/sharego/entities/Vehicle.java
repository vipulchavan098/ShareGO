package com.sharego.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "vehicles")

@AttributeOverride(name = "id", column = @Column(name = "vehicle_id"))

@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"driver"})
public class Vehicle extends BaseEntity {

    @Column(name = "vehicle_name", length = 40)
    private String vehicleName;

    @Column(name = "vehicle_no", length = 20, unique = true)
    private String vehicleNo;

    @Column(name = "vehicle_type", length = 20)
    private String vehicleType;

    private int seats;

    @Column(name = "rent_per_day")
    private double rentPerDay;

    // Many Vehicles ----> One Driver
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    public Vehicle(String vehicleName, String vehicleNo,
                   String vehicleType, int seats, double rentPerDay) {
        super();
        this.vehicleName = vehicleName;
        this.vehicleNo = vehicleNo;
        this.vehicleType = vehicleType;
        this.seats = seats;
        this.rentPerDay = rentPerDay;
    }
}

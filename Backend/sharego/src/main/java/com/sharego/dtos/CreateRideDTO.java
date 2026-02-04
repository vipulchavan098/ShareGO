package com.sharego.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateRideDTO {

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotBlank
    private String rideDate;

    @NotBlank
    private String rideTime;

    @Min(1)
    private int availableSeats;

    @Min(1)
    private double pricePerSeat;

    @NotNull
    private Long driverId;

    @NotNull
    private Long vehicleId;
}

package com.sharego.dtos;

import com.sharego.entities.RideStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRideStatusDTO {

    @NotNull
    private Long rideId;

    @NotNull
    private RideStatus status;
}

package com.sharego.dtos;

import jakarta.validation.constraints.Min;
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
public class BookRideDTO {

    @NotNull
    private Long rideId;

    @NotNull
    private Long passengerId;

    @Min(1)
    private int seats;
}

package com.sharego.dtos;

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
public class RideDTO {

    private Long rideId;
    private String source;
    private String destination;
    private String rideDate;
    private String rideTime;
    private double pricePerSeat;
}

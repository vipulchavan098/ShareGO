package com.sharego.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {

    private Long vehicleId;

    @NotBlank
    private String vehicleName;

    @NotBlank
    private String vehicleNo;

    @NotBlank
    private String vehicleType;

    @Min(1)
    private int seats;

    @Min(1)
    private double rentPerDay;

    @NotNull
    private Long driverId;
}

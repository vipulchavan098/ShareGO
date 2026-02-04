package com.sharego.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PassengerDTO {

    private Long passengerId;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String phone;

    private String address;

    @NotNull
    private Long userId;
}

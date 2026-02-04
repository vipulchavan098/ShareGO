package com.sharego.dtos;

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
public class DriverRegDTO {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String phone;

    @NotBlank
    private String licenseNo;

    @NotBlank
    private String experience;

    @NotNull
    private Long userId;
}

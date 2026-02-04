package com.sharego.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DriverRespDTO {

    private Long driverId;
    private String firstName;
    private String lastName;
    private String phone;
    private String licenseNo;
    private String experience;
}

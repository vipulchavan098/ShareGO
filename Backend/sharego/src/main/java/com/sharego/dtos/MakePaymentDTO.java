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
public class MakePaymentDTO {

    @NotNull
    private Long bookingId;

    @NotNull
    private Long userId;

    @Min(1)
    private double amount;

    @NotBlank
    private String paymentDate;
}

package com.sharego.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "passengers")

@AttributeOverride(name = "id", column = @Column(name = "passenger_id"))

@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"user"})
public class Passenger extends BaseEntity {

    @Column(name = "first_name", length = 30)
    private String firstName;

    @Column(name = "last_name", length = 30)
    private String lastName;

    @Column(unique = true, length = 14)
    private String phone;

    @Column(length = 200)
    private String address;

    // Passenger 1 ---- 1 User
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Passenger(String firstName, String lastName, String phone, String address) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
    }
}

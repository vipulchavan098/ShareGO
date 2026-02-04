package com.sharego.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@AttributeOverride(
        name = "id",
        column = @Column(name = "user_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true,
        exclude = {"password"})
public class User extends BaseEntity {

    @Column(unique = true,
            length = 50,
            nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role",
            length = 20,
            nullable = false)
    private UserRole role;
}

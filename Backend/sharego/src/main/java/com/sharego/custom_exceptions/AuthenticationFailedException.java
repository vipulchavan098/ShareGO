package com.sharego.custom_exceptions;

public class AuthenticationFailedException
        extends RuntimeException {

    public AuthenticationFailedException(
            String message) {

        super(message);
    }
}

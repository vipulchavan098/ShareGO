package com.sharego.custom_exceptions;

public class InvalidInputException
        extends RuntimeException {

    public InvalidInputException(
            String message) {

        super(message);
    }
}

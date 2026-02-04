package com.sharego.exc_handler;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sharego.custom_exceptions.InvalidInputException;
import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<?> handleValidationExceptions(
                        MethodArgumentNotValidException ex) {

                // Collect errors into a string or map
                String errors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(err -> err.getDefaultMessage())
                                .collect(Collectors.joining(", "));

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(new ApiResponse(errors, "VALIDATION_FAILED"));
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<?> handleResourceNotFoundException(
                        ResourceNotFoundException ex) {
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse(ex.getMessage(), "NOT_FOUND"));
        }

        @ExceptionHandler(InvalidInputException.class)
        public ResponseEntity<?> handleInvalidInputException(
                        InvalidInputException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(new ApiResponse(ex.getMessage(), "BAD_REQUEST"));
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<?> handleGlobalException(Exception ex) {
                ex.printStackTrace(); // Log the error
                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ApiResponse(
                                                "An internal error occurred: " + ex.getMessage(),
                                                "INTERNAL_ERROR"));
        }
}

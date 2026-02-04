package com.sharego.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharego.custom_exceptions.InvalidInputException;
import com.sharego.custom_exceptions.ResourceNotFoundException;
import com.sharego.dtos.ApiResponse;
import com.sharego.dtos.BookRideDTO;
import com.sharego.dtos.BookingDTO;
import com.sharego.entities.Booking;
import com.sharego.entities.BookingStatus;
import com.sharego.entities.Passenger;
import com.sharego.entities.Ride;
import com.sharego.repositories.BookingRepository;
import com.sharego.repositories.PassengerRepository;
import com.sharego.repositories.RideRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

        private final BookingRepository bookingRepository;
        private final RideRepository rideRepository;
        private final PassengerRepository passengerRepository;
        private final ModelMapper modelMapper;

        @Override
        public ApiResponse bookRide(BookRideDTO dto) {

                Ride ride = rideRepository.findById(dto.getRideId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid ride ID"));

                Passenger passenger = passengerRepository.findById(dto.getPassengerId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid passenger ID"));

                if (ride.getAvailableSeats() < dto.getSeats()) {
                        throw new InvalidInputException(
                                        "Seats not available");
                }

                Booking booking = new Booking();
                booking.setRide(ride);
                booking.setPassenger(passenger);
                booking.setSeats(dto.getSeats());
                booking.setBookingStatus(BookingStatus.PENDING); // Start as PENDING

                ride.setAvailableSeats(
                                ride.getAvailableSeats() - dto.getSeats());

                bookingRepository.save(booking);

                return new ApiResponse(
                                "Booking requested. Waiting for driver approval.",
                                "SUCCESS");
        }

        @Override
        public ApiResponse approveBooking(Long bookingId, Long driverId) {
                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException("Invalid booking ID"));

                // Verify driver owns the ride
                if (!booking.getRide().getDriver().getId().equals(driverId)) {
                        throw new InvalidInputException("Unauthorized approval");
                }

                if (booking.getBookingStatus() != BookingStatus.PENDING) {
                        throw new InvalidInputException("Booking is not pending");
                }

                booking.setBookingStatus(BookingStatus.CONFIRMED);

                return new ApiResponse("Booking approved", "SUCCESS");
        }

        @Override
        public ApiResponse rejectBooking(Long bookingId, Long driverId) {
                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException("Invalid booking ID"));

                // Verify driver owns the ride
                if (!booking.getRide().getDriver().getId().equals(driverId)) {
                        throw new InvalidInputException("Unauthorized rejection");
                }

                if (booking.getBookingStatus() != BookingStatus.PENDING) {
                        throw new InvalidInputException("Booking is not pending");
                }

                booking.setBookingStatus(BookingStatus.CANCELLED);

                // Refund seats
                booking.getRide().setAvailableSeats(
                                booking.getRide().getAvailableSeats() + booking.getSeats());

                return new ApiResponse("Booking rejected", "SUCCESS");
        }

        @Override
        public List<BookingDTO> getPassengerBookings(Long passengerId) {

                return bookingRepository
                                .findByPassengerId(passengerId)
                                .stream()
                                .map(b -> new BookingDTO(
                                                b.getId(),
                                                b.getSeats(),
                                                b.getBookingStatus(),
                                                b.getPassenger().getFirstName() + " " + b.getPassenger().getLastName(),
                                                b.getRide().getId(),
                                                b.getRide().getSource(),
                                                b.getRide().getDestination(),
                                                b.getRide().getRideDate(),
                                                b.getRide().getRideTime(),
                                                b.getSeats() * b.getRide().getPricePerSeat()))
                                .toList();
        }

        @Override
        public ApiResponse cancelBooking(
                        Long bookingId,
                        Long passengerId) {

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invalid booking ID"));

                if (!booking.getPassenger()
                                .getId()
                                .equals(passengerId)) {

                        throw new InvalidInputException(
                                        "Unauthorized cancellation");
                }

                booking.setBookingStatus(
                                BookingStatus.CANCELLED);

                booking.getRide()
                                .setAvailableSeats(
                                                booking.getRide()
                                                                .getAvailableSeats()
                                                                + booking.getSeats());

                return new ApiResponse(
                                "Booking cancelled",
                                "SUCCESS");
        }

        @Override
        public List<BookingDTO> getDriverBookings(Long driverId) {
                return bookingRepository.getDriverBookings(driverId);
        }
}

package com.gombino.mynotes.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler()
    public ResponseEntity<Object> handelNotFound(NoSuchElementException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler()
    public ResponseEntity<Object> handleExists(ResourceAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler()
    public ResponseEntity<Object> handlePermissionProblem(PermissionDeniedException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
    }

    @ExceptionHandler()
    public ResponseEntity<Object> handleBadRequest(BadRequestException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }
}

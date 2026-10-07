package com.studentmanagement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", ex.getMessage());

        HttpStatus status = HttpStatus.BAD_REQUEST;

        if (ex.getMessage() != null) {
            String msg = ex.getMessage().toLowerCase();
            if (msg.contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            } else if (msg.contains("authorized") || msg.contains("not assigned")) {
                status = HttpStatus.FORBIDDEN;
            } else if (msg.contains("duplicate") || msg.contains("already exists")) {
                status = HttpStatus.CONFLICT;
            }
        }

        return new ResponseEntity<>(response, status);
    }
}

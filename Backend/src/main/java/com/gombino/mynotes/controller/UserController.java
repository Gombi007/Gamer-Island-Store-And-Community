package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.dto.RegistrationUserDto;
import com.gombino.mynotes.models.dto.RoleToUserFormDto;
import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    @PostMapping("/registration")
    public ResponseEntity<User> saveUser(@RequestBody RegistrationUserDto registrationUserDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registrationUser(registrationUserDto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok().body(userService.getUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return ResponseEntity.ok().body(userService.getRoles());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/roles/save")
    public ResponseEntity<Role> saveRole(@RequestBody Role role) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.saveRole(role));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/roles/add-role-to-user")
    public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserFormDto form) {
        userService.addRoleToUser(form.getUsername(), form.getRoleName());
        return ResponseEntity.ok().build();
    }
}

package com.gombino.mynotes.controller;

import com.gombino.mynotes.exceptions.BadRequestException;
import com.gombino.mynotes.models.dto.*;
import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "UserController", description = "Manages Users and registration")
public class UserController {
    private final UserService userService;

    @Operation(description = "Registration a user")
    @PostMapping("/registration")
    public ResponseEntity<?> saveUser(@RequestBody RegistrationUserDto registrationUserDto) {
        userService.registrationUser(registrationUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(description = "Get all user by admin")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserModifyByAdminDto>> getUsersByAdmin() {
        return ResponseEntity.ok().body(userService.getUsersToAdminModify());
    }

    @Operation(description = "Update a user by admin")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users")
    public ResponseEntity<UserModifyByAdminDto> updateUserByAdmin(@RequestBody UserModifyByAdminDto user) {
        return ResponseEntity.ok().body(userService.updateUserByAdmin(user));
    }

    @Operation(description = "Has user role admin or not")
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/roles/has-role-admin/{userId}")
    public ResponseEntity<Boolean> hasRoleAdmin(@PathVariable String userId) {
        return ResponseEntity.ok().body(userService.hasAdminRole(userId));
    }
    @Operation(description = "Get all role from the DB")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return ResponseEntity.ok().body(userService.getRoles());
    }

    @Operation(description = "Save a new role")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/roles/save")
    public ResponseEntity<Role> saveRole(@RequestBody Role role) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.saveRole(role));
    }

    @Operation(description = "Add a role to user")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/roles/add-role-to-user")
    public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserFormDto form) {
        userService.addRoleToUser(form.getUsername(), form.getRoleName());
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Get a user profile by user id")
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserDto> getProfileData(@PathVariable String userId) {
        return ResponseEntity.ok().body(userService.getProfileData(userId));
    }

    @Operation(description = "Update a user by user id")
    @PreAuthorize("hasRole('USER')")
    @PutMapping("/profile/{userId}")
    public ResponseEntity<UserDto> updateUserProfile(@PathVariable String userId, @RequestBody UserDto userDto) {
        return ResponseEntity.ok().body(userService.updateUserProfile(userId, userDto));
    }

    @Operation(description = "Change a user password by user id")
    @PreAuthorize("hasRole('USER')")
    @PutMapping("/profile/change-password/{userId}")
    public ResponseEntity<UserDto> changeUserPassword(@PathVariable String userId, @RequestBody UserPasswordDto userPasswordDto) {
        userService.changeUserPassword(userId, userPasswordDto);
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Get user transaction history")
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/profile/transaction-history/{userId}")
    public ResponseEntity<List<GamePurchaseDto>> getUserTransactionHistory(@PathVariable String userId) {
        return ResponseEntity.ok().body(userService.getUserTransactionHistory(userId));
    }

}

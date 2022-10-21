package com.gombino.mynotes.services;

import com.gombino.mynotes.exceptions.ResourceAlreadyExistsException;
import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.repositories.RoleRepository;
import com.gombino.mynotes.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public User saveUser(User user) {
        if (userRepository.findUserByUsername(user.getUsername()).isPresent()) {
            throw new ResourceAlreadyExistsException("This username is already taken: " + user.getUsername());
        }

        log.warn("Saving new user {} to the DB", user.getUsername());
        user.setCreated(Instant.now());
        user.setIsDisabled(false);
        user.setRoles(new ArrayList<>());
        Role role = roleRepository.findRoleByRoleName("ROLE_USER").get();
        log.warn("Add basic role {} to the new user {} to the DB", role.getRoleName(), user.getUsername());
        user.getRoles().add(role);
        return userRepository.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        log.warn("Saving new role {} to the DB", role.getRoleName());
        if (roleRepository.findRoleByRoleName(role.getRoleName()).isPresent()) {
            throw new ResourceAlreadyExistsException("This role is already exist: " + role.getRoleName());
        }

        return roleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.warn("Adding role {} to user {}", roleName, username);
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> new NoSuchElementException("There is now User with this username: " + username));
        Role role = roleRepository.findRoleByRoleName(roleName).orElseThrow(() -> new NoSuchElementException("There is no role with this role name: " + roleName));

        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
        }
        userRepository.save(user);

    }

    @Override
    public User getUser(String username) {
        log.warn("Fetching user {}", username);
        return userRepository.findUserByUsername(username).orElseThrow(() -> new NoSuchElementException("No user with this username: " + username));
    }

    @Override
    public List<User> getUsers() {
        log.warn("Fetching all user");
        return userRepository.findAll();
    }
}

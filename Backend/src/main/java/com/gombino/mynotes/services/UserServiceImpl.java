package com.gombino.mynotes.services;

import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.repositories.RoleRepository;
import com.gombino.mynotes.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;

    @Override
    public User saveUser(User user) {
        log.warn("Saving new user {} to the DB", user.getUsername());
        return userRepository.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        log.warn("Saving new role {} to the DB", role.getRoleName());
        return roleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.warn("Adding role {} to user {}", roleName, username);
        User user = userRepository.findUserByUsername(username);
        Role role = roleRepository.findRoleByRoleName(roleName);
        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
        }
        userRepository.save(user);

    }

    @Override
    public User getUser(String username) {
        log.warn("Fetching user {}", username);
        return userRepository.findUserByUsername(username);
    }

    @Override
    public List<User> getUsers() {
        log.warn("Fetching all user");
        return userRepository.findAll();
    }
}

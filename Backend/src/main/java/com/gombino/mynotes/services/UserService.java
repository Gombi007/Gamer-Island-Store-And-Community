package com.gombino.mynotes.services;

import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.models.entities.User;

import java.util.List;

public interface UserService {

    User saveUser(User user);

    Role saveRole(Role role);

    void addRoleToUser(String username, String roleName);

    User getUser(String username);

    List<User> getUsers();
}

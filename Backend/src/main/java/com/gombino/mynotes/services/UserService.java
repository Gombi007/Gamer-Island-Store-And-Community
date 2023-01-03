package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.*;
import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.models.entities.User;

import java.util.List;

public interface UserService {

    User registrationUser(RegistrationUserDto registrationUserDto);

    Role saveRole(Role role);

    User updateUser(User user);

    void addRoleToUser(String username, String roleName);

    void setLastLoginDate(User user);

    User getUser(String username);

    User getUserById(String userId);

    List<Role> getRoles();

    List<User> getUsers();

    List<UserModifyByAdminDto> getUsersToAdminModify();

    UserDto getProfileData(String userId);

    UserDto updateUserProfile(String userId, UserDto userDto);

    void changeUserPassword(String userId, UserPasswordDto userPasswordDto);

    List<GamePurchaseDto> getUserTransactionHistory(String userId);

    Boolean hasAdminRole(String userId);
}

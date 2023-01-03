package com.gombino.mynotes.services;

import com.gombino.mynotes.exceptions.PermissionDeniedException;
import com.gombino.mynotes.exceptions.ResourceAlreadyExistsException;
import com.gombino.mynotes.models.dto.*;
import com.gombino.mynotes.models.entities.GamePurchase;
import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.repositories.GamePurchaseRepository;
import com.gombino.mynotes.repositories.RoleRepository;
import com.gombino.mynotes.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final GamePurchaseRepository gamePurchaseRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final ModelMapper modelMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> new NoSuchElementException("There is no user with this username: " + username));
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getRoleName()));
        });
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    @Override
    public User registrationUser(RegistrationUserDto registrationUserDto) {
        if (userRepository.findUserByUsername(registrationUserDto.getUsername()).isPresent()) {
            throw new ResourceAlreadyExistsException("This username is already taken: " + registrationUserDto.getUsername());
        }
        if (registrationUserDto.getPassword().length() < 6) {
            throw new PermissionDeniedException("Password must be at least six character");
        }

        User newUser = new User();

        if (registrationUserDto.getEmail() == null || registrationUserDto.getEmail().isEmpty()) {
            newUser.setEmail("");
        } else {
            newUser.setEmail(registrationUserDto.getEmail());
        }

        if (registrationUserDto.getAvatar() == null || registrationUserDto.getAvatar().isEmpty()) {
            newUser.setAvatar("https://www.meme-arsenal.com/memes/1c9bec1c1817f33f756ce195fab4e02f.jpg");
        } else {
            newUser.setAvatar(registrationUserDto.getAvatar());
        }

        newUser.setUsername(registrationUserDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationUserDto.getPassword()));
        newUser.setCreated(Instant.now());
        newUser.setIsDisabled(false);
        newUser.setRoles(new ArrayList<>());
        newUser.setNoteIds(new ArrayList<>());
        newUser.setFavoriteNotesIds(new ArrayList<>());
        newUser.setWishlistGames(new ArrayList<>());
        newUser.setOwnedGames(new ArrayList<>());
        newUser.setBalance(500.0);

        Role role = roleRepository.findRoleByRoleName("ROLE_USER").get();
        log.warn("Add basic role {} to the new user {} to the DB", role.getRoleName(), newUser.getUsername());
        newUser.getRoles().add(role);
        log.warn("Saving new user {} to the DB", registrationUserDto.getUsername());
        return userRepository.save(newUser);
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
    public User updateUser(User user) {
        if (!userRepository.findUserById(user.getId()).isPresent()) {
            throw new NoSuchElementException("There is now User with this id: " + user.getId());
        }
        return userRepository.save(user);
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
    public void setLastLoginDate(User user) {
        userRepository.findUserByUsername(user.getUsername()).orElseThrow(() -> new NoSuchElementException("No user with this username: " + user.getUsername()));
        user.setLastLogin(Instant.now());
        userRepository.save(user);
    }

    @Override
    public User getUser(String username) {
        return userRepository.findUserByUsername(username).orElseThrow(() -> new NoSuchElementException("No user with this username: " + username));
    }

    @Override
    public User getUserById(String userId) {
        return userRepository.findUserById(userId).orElseThrow(() -> new NoSuchElementException("No user with this id: " + userId));
    }

    @Override
    public List<Role> getRoles() {
        log.warn("Fetching all role");
        return roleRepository.findAll();
    }

    @Override
    public List<User> getUsers() {
        log.warn("Fetching all user");
        return userRepository.findAll();
    }

    @Override
    public List<UserModifyByAdminDto> getUsersToAdminModify() {
        log.warn("Fetching all user");
        return userRepository.findAll().stream().map(this::convertToUserModifyByAdminDto).collect(Collectors.toList());
    }

    @Override
    public UserDto getProfileData(String userId) {
        User user = getUserById(userId);
        return convertToUserDto(user);
    }

    @Override
    public UserDto updateUserProfile(String userId, UserDto userDto) {
        User user = getUserById(userId);
        user.setEmail(userDto.getEmail());
        user.setAvatar(userDto.getAvatar());
        log.warn("User profile was updated {}", user.getUsername());
        return convertToUserDto(userRepository.save(user));
    }

    @Override
    public void changeUserPassword(String userId, UserPasswordDto userPasswordDto) {
        User user = getUserById(userId);
        boolean areOriginalPasswordsSame = passwordEncoder.matches(userPasswordDto.getOriginalPassword(), user.getPassword());
        boolean areNewAndConfirmedPasswordsSame = userPasswordDto.getNewPassword().equals(userPasswordDto.getConfirmNewPassword());
        if (userPasswordDto.getNewPassword().length() < 6) {
            throw new PermissionDeniedException("Password must be at least six character");
        }
        if (!areOriginalPasswordsSame) {
            throw new PermissionDeniedException("Current password is not valid.");
        }
        if (!areNewAndConfirmedPasswordsSame) {
            throw new PermissionDeniedException("The new password and the confirm new password are different");
        }
        user.setPassword(passwordEncoder.encode(userPasswordDto.getNewPassword()));
        userRepository.save(user);
    }

    //Converters
    private UserDto convertToUserDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    private User convertToUser(UserDto userDto) {
        return modelMapper.map(userDto, User.class);
    }

    private UserModifyByAdminDto convertToUserModifyByAdminDto(User user) {
        return modelMapper.map(user, UserModifyByAdminDto.class);
    }

    @Override
    public List<GamePurchaseDto> getUserTransactionHistory(String userId) {
        User user = userRepository.findUserById(userId).orElseThrow(() -> new NoSuchElementException("No user with this id: " + userId));
        List<GamePurchaseDto> gamePurchaseDtoList = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm").withZone(ZoneId.systemDefault());

        if (user != null) {
            List<GamePurchase> gamePurchaseList = gamePurchaseRepository.findByUserId(user.getId());
            for (GamePurchase gamePurchase : gamePurchaseList) {
                String purchaseFormattedDate = formatter.format(gamePurchase.getPurchaseDate());
                GamePurchaseDto gamePurchaseDto = new GamePurchaseDto(gamePurchase.getUserId(), gamePurchase.getGameId(), gamePurchase.getItem(), purchaseFormattedDate, gamePurchase.getPrice());
                gamePurchaseDtoList.add(gamePurchaseDto);
            }
            return gamePurchaseDtoList;

        }
        return null;
    }

    @Override
    public Boolean hasAdminRole(String userId) {
        User user = getUserById(userId);
        Boolean hasAdminRole = false;
        for (Role role : user.getRoles()) {
            if (role.getRoleName().equals("ROLE_ADMIN")) {
                hasAdminRole = true;
            }
        }
        return hasAdminRole;
    }
}

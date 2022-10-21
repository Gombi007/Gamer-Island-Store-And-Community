package com.gombino.mynotes.models.dto;

import lombok.Data;

@Data
public class RegistrationUserDto {
    private String username;
    private String email;
    private String password;
    private String avatar;
}

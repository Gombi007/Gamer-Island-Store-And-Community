package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPasswordDto {
    private String originalPassword;
    private String newPassword;
    private String confirmNewPassword;
}

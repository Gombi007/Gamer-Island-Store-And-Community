package com.gombino.mynotes.models.dto;

import com.gombino.mynotes.models.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserModifyByAdminDto {
    private String id;
    private String username;
    private String email;
    private String avatar;
    private String lastLogin;
    private String created;
    private Boolean isDisabled;
    private List<Role> roles;
    private List<String> noteIds;
    private List<String> favoriteNotesIds;
    private List<String> wishlistGames;
    private List<String> ownedGames;
}

package com.gombino.mynotes.models.entities;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Tag(name = "User entity")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String avatar;
    private Instant lastLogin;
    private Instant created;
    private Boolean isDisabled;
    private List<Role> roles;
}

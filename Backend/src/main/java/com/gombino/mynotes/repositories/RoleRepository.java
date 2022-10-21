package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {

    @Query("{roleName:'?0'}")
    Optional<Role> findRoleByRoleName(String roleName);
}

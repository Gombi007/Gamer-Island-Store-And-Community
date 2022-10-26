package com.gombino.mynotes;

import com.gombino.mynotes.models.entities.Role;
import com.gombino.mynotes.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
@Slf4j
public class MyNotesApplication {
    @Bean
    BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(4);
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Value("${SERVER_CORS_PERMSSION}")
    private String cors1;
    @Value("${SERVER_CORS_PERMSSION_1}")
    private String cors2;
    @Value("${SERVER_CORS_PERMSSION_2}")
    private String cors3;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**").allowedOrigins(cors1, cors2, cors3).allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }

    @Bean
    CommandLineRunner run(UserService userService) {
        return args -> {
            if (userService.getRoles().isEmpty()) {
                userService.saveRole(new Role(null, "ROLE_USER"));
                userService.saveRole(new Role(null, "ROLE_ADMIN"));
            }
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(MyNotesApplication.class, args);
    }

}

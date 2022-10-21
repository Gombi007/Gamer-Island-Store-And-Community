package com.gombino.mynotes;

import com.gombino.mynotes.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
public class MyNotesApplication {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:4200/").allowedMethods("GET", "POST", "PUT", "DELETE");

            }
        };
    }

    @Bean
    CommandLineRunner run(UserService userService) {
        return args -> {
            //   userService.saveRole(new Role(null, "ROLE_USER"));
            //   userService.saveRole(new Role(null, "ROLE_ADMIN"));
            //   userService.saveUser(new User(null, "admin", "email@test.hu", "1234", "https://www.google.com", null, null, null, null));
            //   userService.addRoleToUser("admin", "ROLE_ADMIN");
        };
    }


    public static void main(String[] args) {
        SpringApplication.run(MyNotesApplication.class, args);
    }

}

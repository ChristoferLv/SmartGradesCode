package com.projeto1.demo.misc;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allows CORS on all paths
                .allowedOrigins("http://localhost:3000") // Replace with your frontend origin
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allowed methods
                .allowedHeaders("*") // Allowed headers
                .allowCredentials(true); // Allow sending cookies
    }
}

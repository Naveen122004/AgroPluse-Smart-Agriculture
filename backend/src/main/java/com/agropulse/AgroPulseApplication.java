package com.agropulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AgroPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgroPulseApplication.class, args);
    }
}

package com.fintech.pob;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PobApplication {

	public static void main(String[] args) {
		SpringApplication.run(PobApplication.class, args);
	}

}

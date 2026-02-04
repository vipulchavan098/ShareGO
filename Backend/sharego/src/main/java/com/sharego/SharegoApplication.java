package com.sharego;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SharegoApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                SharegoApplication.class,
                args);
    }
}





















//package com.sharego;
//
//import org.modelmapper.Conditions;
//import org.modelmapper.ModelMapper;
//import org.modelmapper.convention.MatchingStrategies;
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.Bean;
//
//@SpringBootApplication
//public class SharegoApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(SharegoApplication.class, args);
//	}
//	
//	@Bean // <bean id class ...../>
//	ModelMapper modelMapper() {
//		System.out.println("creating n configuring model mapper");
//		ModelMapper mapper = new ModelMapper();
//		//1. set matching strategy - STRICT => Transfer only those props with matching names & data types
//		mapper.getConfiguration()
//		.setMatchingStrategy(MatchingStrategies.STRICT)
//		//2. DO not transfer null values from src->dest
//		.setPropertyCondition(Conditions.isNotNull());		
//		return mapper;
//	}
//
//}

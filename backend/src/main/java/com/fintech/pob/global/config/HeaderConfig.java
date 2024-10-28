package com.fintech.pob.global.config;

import com.fintech.pob.global.header.interceptor.HeaderInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class HeaderConfig implements WebMvcConfigurer {

    private final HeaderInterceptor headerInterceptor;

    @Autowired
    public HeaderConfig(HeaderInterceptor headerInterceptor) {
        this.headerInterceptor = headerInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(headerInterceptor).addPathPatterns("/**/client/**");
    }
}

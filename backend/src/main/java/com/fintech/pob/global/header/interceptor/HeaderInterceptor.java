package com.fintech.pob.global.header.interceptor;

import com.fintech.pob.global.auth.jwt.JwtUtil;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import com.fintech.pob.global.header.service.HeaderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;


@Component
public class HeaderInterceptor implements HandlerInterceptor {

    private final HeaderService headerService;
    private final JwtUtil jwtUtil;

    public HeaderInterceptor(HeaderService headerService, JwtUtil jwtUtil) {
        this.headerService = headerService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        if (request.getAttribute("accessInterceptor") != null) {
            return true; // 재실행 방지
        }
        request.setAttribute("accessInterceptor", true);

        String token = request.getHeader("Authorization");
        String apiName = request.getRequestURI().substring(request.getRequestURI().lastIndexOf("/") + 1);

        String userKey = jwtUtil.extractUserKey(token);
        //String userKey = request.getHeader("userKey");

        HeaderRequestDTO header = headerService.createCommonHeader(apiName, userKey);
        request.setAttribute("header", header);

        return true;
    }
}
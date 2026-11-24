package com.gym.springboot.controller;

import com.gym.springboot.DTO.command.UserLoginCommandDTO;
import com.gym.springboot.DTO.response.UserLoginResponseDTO;
import com.gym.springboot.common.Result;
import com.gym.springboot.service.UserService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")

public class User {

    @Resource
    private UserService userService;

    @PostMapping("/login")
    public Result<UserLoginResponseDTO> login(@Valid @RequestBody UserLoginCommandDTO commandDTO) {
        System.out.println(commandDTO.getUsername());
        System.out.println(commandDTO.getPassword());

        // 调用服务层的登录方法
        Result<UserLoginResponseDTO> result = userService.login(commandDTO);
        System.out.println(result);

        return result;
    }
}

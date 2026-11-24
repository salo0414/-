package com.gym.springboot.controller;

import com.gym.springboot.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController//标识这是一个控制器类
@RequestMapping("/api")//标识这是一个控制器类，所有方法的公共前缀是/api
public class Test {
    @GetMapping("/test")
    public Result<String> test() {
//        Result result = new Result();
//        result.setCode("200");
//        System.out.println(result.getCode());
        return Result.ok("Hello, World!");
    }
}

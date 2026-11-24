package com.gym.springboot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gym.springboot.DTO.command.UserLoginCommandDTO;
import com.gym.springboot.DTO.response.UserLoginResponseDTO;
import com.gym.springboot.common.Result;
import com.gym.springboot.entity.User;
import com.gym.springboot.exception.BusinessException;
import com.gym.springboot.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Resource
    private UserMapper userMapper;

    public Result<UserLoginResponseDTO> login(UserLoginCommandDTO commandDTO) {
        //构建查询条件
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, commandDTO.getUsername())
                .or()
                .eq(User::getEmail, commandDTO.getUsername());
        //调用MP API的查询
        User user = userMapper.selectOne(queryWrapper);
        System.out.println(user);

        //判断用户是否存在
        if (user == null) {
            throw new BusinessException("用户名不存在");
        }

        return null;
    }
}

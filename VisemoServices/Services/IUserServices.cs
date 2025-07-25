﻿using Microsoft.AspNetCore.Http;
using VisemoServices.Dtos.User;
using VisemoServices.Model;

namespace VisemoServices.Services
{
    public interface IUserServices
    {
        Task<User?> Login(string email, string password);
        Task<User> SignUp(UserSignupDto userDto, IWebHostEnvironment env);
        Task<User?> CheckUser(int userId);
    }
}

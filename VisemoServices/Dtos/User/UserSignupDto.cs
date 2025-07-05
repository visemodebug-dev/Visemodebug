using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace VisemoServices.Dtos.User
{
    public class UserSignupDto
    {
       public required string Email { get; set; }
       public required string Password { get; set; }
       public required string FirstName { get; set; }
       public required string LastName { get; set; }
       public required string MiddleInitial { get; set; }
       public required string IdNumber { get; set; }
       public required IFormFile IdImage { get; set; }
       public string Role { get; set; }
    }
}

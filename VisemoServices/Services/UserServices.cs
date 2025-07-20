using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using VisemoServices.Data;
using VisemoServices.Dtos.User;
using VisemoServices.Model;

namespace VisemoServices.Services
{
    public class UserServices : IUserServices
    {
        private readonly DatabaseContext _context;

        public UserServices(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<User?> Login(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null;
            }
            return user;
        }

        public async Task<User?> CheckUser(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User> SignUp(UserSignupDto dto, IWebHostEnvironment env)
        {
            // Check for existing user
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                throw new Exception("User already exists");
            }

            //// Upload image
            //if (idImage == null || idImage.Length == 0)
            //{
            //    throw new ArgumentException("ID image is required.");
            //}

            //var uploadsFolder = Path.Combine(env.WebRootPath ?? "wwwroot", "uploads");
            //Directory.CreateDirectory(uploadsFolder);

            //var fileName = $"{Guid.NewGuid()}_{idImage.FileName}";
            //var filePath = Path.Combine(uploadsFolder, fileName);

            //using (var stream = new FileStream(filePath, FileMode.Create))
            //{
            //    await idImage.CopyToAsync(stream);
            //}

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newUser = new User
            {
                Email = dto.Email,
                Password = hashedPassword,
                firstName = dto.FirstName,
                lastName = dto.LastName,
                middleInitial = dto.MiddleInitial,
                idNumber = dto.IdNumber,
                //idImage = Path.Combine("uploads", fileName),
                role = dto.Role
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }
    }
}

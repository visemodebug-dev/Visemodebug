using Microsoft.EntityFrameworkCore;
using VisemoServices.Data;
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
                return null; // Invalid login
            }

            return user; // Successful login
        }

        public async Task<User> SignUp(string email, string password)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                throw new Exception("User already exists");
            }

            // Hash password before saving
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var newUser = new User
            {
                Email = email,
                Password = hashedPassword
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }

        public async Task<User?> CheckUser(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}

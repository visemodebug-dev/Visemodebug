using VisemoServices.Model;

namespace VisemoServices.Services
{
    public interface IUserServices
    {
        Task<User?> Login(string email, string password);

        Task<User> SignUp(string email, string password);

        Task<User?> CheckUser(string email);
    }
}

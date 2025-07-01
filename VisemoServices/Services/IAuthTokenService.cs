using VisemoServices.Model;

namespace VisemoServices.Services
{
    public interface IAuthTokenService
    {
        string GenerateToken(User user);
    }
}

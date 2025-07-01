namespace VisemoServices.Dtos.User
{
    public class UserDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string MiddleInitial { get; set; } = null!;
        public string IdNumber { get; set; } = null!;
    }
}

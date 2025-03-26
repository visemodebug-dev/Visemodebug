using Microsoft.AspNetCore.Mvc;
using VisemoServices.Model;
using VisemoServices.Services;

namespace VisemoServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserServices _userServices;

        public UserController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var loggedInUser = await _userServices.Login(user.Email, user.Password);
            if (loggedInUser == null)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(loggedInUser);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] User user)
        {
            try
            {
                var newUser = await _userServices.SignUp(user.Email, user.Password);
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CheckUser")]
        public async Task<IActionResult> CheckUser([FromQuery] string email)
        {
            var user = await _userServices.CheckUser(email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { message = "User exists", user });
        }
    }
}

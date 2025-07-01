using Microsoft.AspNetCore.Mvc;
using VisemoServices.Model;
using VisemoServices.Services;
using VisemoServices.Dtos.User;

namespace VisemoServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IWebHostEnvironment _env;
        private readonly IAuthTokenService _authTokenService;

        public UserController(IUserServices userServices, IAuthTokenService authTokenService, IWebHostEnvironment env)
        {
            _userServices = userServices;
            _authTokenService = authTokenService;
            _env = env;
        }

        [HttpPost("signup")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SignUp([FromForm] UserSignupDto userDto)
        {
            try
            {
                var newUser = await _userServices.SignUp(userDto, userDto.IdImage, _env);
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            var loggedInUser = await _userServices.Login(login.Email, login.Password);
            if (loggedInUser == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var token = _authTokenService.GenerateToken(loggedInUser);

            return Ok(new
            {
                token,
                user = new
                {
                    loggedInUser.Id,
                    loggedInUser.Email,
                    loggedInUser.firstName,
                    loggedInUser.lastName,
                    loggedInUser.middleInitial,
                    loggedInUser.idNumber,
                    loggedInUser.idImage
                }
            });
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

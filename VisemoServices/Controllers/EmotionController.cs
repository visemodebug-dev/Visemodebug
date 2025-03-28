using Microsoft.AspNetCore.Mvc;
using VisemoServices.Services;
using System.Threading.Tasks;


namespace VisemoServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmotionController : ControllerBase
    {
        private readonly IEmotionServices _emotionServices;
        public EmotionController(IEmotionServices emotionServices)
        {
            _emotionServices = emotionServices;
        }
      

        [HttpPost("predict-image")]
        public async Task<IActionResult> PredictImage([FromForm] IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return BadRequest("Invalid image file.");

            try
            {
                var output = await _emotionServices.PredictImageAsync(imageFile);
                return Ok(output);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using VisemoServices.Services;
using System.Threading.Tasks;


namespace VisemoServices.Controllers
{
    [Route("api/emotion")]
    [ApiController]
    public class EmotionController : ControllerBase
    {
        private readonly IEmotionServices _emotionServices;
        public EmotionController(IEmotionServices emotionServices)
        {
            _emotionServices = emotionServices;
        }


        //[HttpPost("predict-image")]
        //public async Task<IActionResult> PredictImage([FromForm] IFormFile imageFile)
        //{
        //    if (imageFile == null || imageFile.Length == 0)
        //        return BadRequest("Invalid image file.");

        //    try
        //    {
        //        var output = await _emotionServices.PredictImageAsync(imageFile);
        //        return Ok(output);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error: {ex.Message}");
        //    }
        //}

        [HttpPost("detect")]
        public async Task<IActionResult> DetectEmotion([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No image uploaded.");
            }

            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            byte[] imageBytes = memoryStream.ToArray();

            string emotion = await _emotionServices.DetectEmotionAsync(imageBytes);
            return Ok(new { emotion });
        }
    }
}

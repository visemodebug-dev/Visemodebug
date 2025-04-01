using Microsoft.AspNetCore.Mvc;
using VisemoServices.Services;
using System.Threading.Tasks;
using VisemoServices.Model;


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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> DetectEmotion([FromForm] ImageUploadRequest request)
        {
            if (request.Image == null || request.Image.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            using var memoryStream = new MemoryStream();
            await request.Image.CopyToAsync(memoryStream);
            byte[] imageBytes = memoryStream.ToArray();

            string result = await _emotionServices.DetectEmotionAsync(imageBytes);
            return Ok(result);
        }
    }
}

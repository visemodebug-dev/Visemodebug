using Microsoft.AspNetCore.Mvc;
using VisemoServices.Dtos.Emotion;
using VisemoServices.Services;

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

        [HttpPost("DetectEmotion")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Predict([FromForm] EmotionUploadDto input)
        {
            if (input.Image == null || input.Image.Length == 0)
                return BadRequest("Image is required");

            var (categorizedData, rawEmotion) = await _emotionServices.PredictEmotionAsync(input.Image, input.UserId, input.ActivityId);

            return Ok(new
            {
                message = "Emotion detected and categorized successfully.",
                detectedEmotion = rawEmotion,
                data = categorizedData
            });
        }

    }
}

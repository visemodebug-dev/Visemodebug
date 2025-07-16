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

        [HttpGet("AggregateEmotions")]
        public async Task<IActionResult> AggregateEmotions([FromQuery] int activityId)
        {
            var result = await _emotionServices.AggregateEmotions(activityId);
            return Ok(result);
        }

        [HttpGet("GetEmotionsPerStudent")]
        public async Task<IActionResult> GetEmotionsPerStudent([FromQuery] int userId, [FromQuery] int activityId)
        {
            var (positive, negative, neutral) = await _emotionServices.GetEmotionsPerStudent(userId, activityId);

            return Ok(new
            {
                userId,
                activityId,
                emotions = new
                {
                    positive,
                    negative,
                    neutral
                }
            });
        }

    }
}

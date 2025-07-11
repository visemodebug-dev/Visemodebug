using Microsoft.AspNetCore.Http;
using VisemoAlgorithm.Service;

namespace VisemoServices.Services
{
    public class EmotionServices : IEmotionServices
    {
        private readonly EmotionDetection _detection;

        public EmotionServices(EmotionDetection detection)
        {
            _detection = detection;
        }

        public async Task<string> PredictEmotionAsync(IFormFile imageFile)
        {
            return await _detection.DetectEmotion(imageFile);
        }
    }
}

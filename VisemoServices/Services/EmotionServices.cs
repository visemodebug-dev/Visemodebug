using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using VisemoAlgorithm.Service;
using VisemoServices.Data;
using VisemoAlgorithm.Model;
using VisemoAlgorithm.Data;

namespace VisemoServices.Services
{
    public class EmotionServices : IEmotionServices
    {
        private readonly EmotionDetection _detection;
        private readonly EmotionCategorizationService _categorization;
        private readonly VisemoAlgoDbContext _dbContext;

        public EmotionServices(EmotionDetection detection, EmotionCategorizationService categorization, VisemoAlgoDbContext dbContext)
        {
            _detection = detection;
            _categorization = categorization;
            _dbContext = dbContext;
        }

        public async Task<(UserEmotion, string Emotion)> PredictEmotionAsync(IFormFile imageFile, int userId, int activityId)
        {
            // Step 1: Get the emotion from FastAPI
            var emotion = await _detection.DetectEmotion(imageFile);

            // Step 2: Categorize and store in VisemoAlgoDb
            await _categorization.CategorizeAndStore(emotion, userId, activityId);

            var userEmotion = await _dbContext.UserEmotions.FirstOrDefaultAsync(u => u.UserId == userId);
            return (userEmotion, emotion);
        }
    }
}

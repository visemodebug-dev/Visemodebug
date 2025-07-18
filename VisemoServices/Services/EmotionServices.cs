using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using VisemoAlgorithm.Service;
using VisemoServices.Data;
using VisemoAlgorithm.Model;
using VisemoAlgorithm.Data;
using VisemoAlgorithm.Dtos;

namespace VisemoServices.Services
{
    public class EmotionServices : IEmotionServices
    {
        private readonly EmotionDetection _detection;
        private readonly EmotionCategorizationService _categorization;
        private readonly EmotionHandler _handler;
        private readonly VisemoAlgoDbContext _dbContext;

        public EmotionServices(EmotionDetection detection, EmotionCategorizationService categorization, VisemoAlgoDbContext dbContext, EmotionHandler handler)
        {
            _detection = detection;
            _categorization = categorization;
            _dbContext = dbContext;
            _handler = handler;
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

        public async Task<AggregatedEmotionDto> AggregateEmotions(int activityId)
        {
            return await _handler.AggregateEmotions(activityId);
        }

        public async Task<(int positive, int negative, int neutral)> GetEmotionsPerStudent(int userId, int activityId)
        {
            return await _handler.GetEmotionsPerStudent(userId, activityId);
        }
    }
}

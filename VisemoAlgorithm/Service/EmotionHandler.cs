using Microsoft.EntityFrameworkCore;
using VisemoAlgorithm.Data;
using VisemoAlgorithm.Dtos;

namespace VisemoAlgorithm.Service
{
    public class EmotionHandler
    {

        private readonly VisemoAlgoDbContext _context;

        public EmotionHandler(VisemoAlgoDbContext context)
        {
            _context = context;
        }
        public async Task<AggregatedEmotionDto> AggregateEmotions(int activityId)
        {
            var emotionEntries = await _context.UserEmotions
                .Where(e => e.ActivityId == activityId)
                .ToListAsync();

            var totalPositive = emotionEntries.Sum(e => e.PositiveEmotions);
            var totalNegative = emotionEntries.Sum(e => e.NegativeEmotions);
            var totalNeutral = emotionEntries.Sum(e => e.NeutralEmotions);

            return new AggregatedEmotionDto
            {
                ActivityId = activityId,
                TotalPositiveEmotions = totalPositive,
                TotalNegativeEmotions = totalNegative,
                TotalNeutralEmotions = totalNeutral
            };
        }

        public async Task<(int positive, int negative, int neutral)> GetEmotionsPerStudent(int userId, int activityId)
        {
            var userEmotion = await _context.UserEmotions
                .FirstOrDefaultAsync(e => e.UserId == userId && e.ActivityId == activityId);

            if (userEmotion == null)
            {
                return (0, 0, 0); // No emotion data recorded yet
            }

            return (
                userEmotion.PositiveEmotions,
                userEmotion.NegativeEmotions,
                userEmotion.NeutralEmotions
            );
        }


    }
}

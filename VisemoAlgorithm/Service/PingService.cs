using Microsoft.EntityFrameworkCore;
using VisemoAlgorithm.Data;
using VisemoAlgorithm.Model;

namespace VisemoAlgorithm.Services
{
    public class PingService
    {
        private readonly VisemoAlgoDbContext _context;

        public PingService(VisemoAlgoDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckForPing(int userId, int activityId)
        {
            // Get the start time
            var session = await _context.ActivitySessions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.ActivityId == activityId);
            if (session == null) return false;

            var elapsed = DateTime.UtcNow - session.StartTime;
            if (elapsed.TotalMinutes < 10) return false; // not yet past threshold

            var emotions = await _context.UserEmotions
                .Where(e => e.UserId == userId && e.ActivityId == activityId)
                .OrderByDescending(e => e.Id)
                .Take(100) // safe buffer
                .ToListAsync();

            if (!emotions.Any()) return false;

            // Flatten emotion entries into individual results
            var emotionList = new List<string>();
            foreach (var e in emotions.OrderBy(e => e.Id))
            {
                emotionList.AddRange(Enumerable.Repeat("positive", e.PositiveEmotions));
                emotionList.AddRange(Enumerable.Repeat("negative", e.NegativeEmotions));
                emotionList.AddRange(Enumerable.Repeat("neutral", e.NeutralEmotions));
            }

            int totalEmotions = emotionList.Count;
            int batchSize = 10;

            if (totalEmotions < 20) return false; // Wait for at least 20 emotions before first check

            int currentBatchIndex = (totalEmotions - 10) / 10; // determines which batch we're checking

            // Check if already pinged for this batch
            var alreadyPinged = await _context.PingLogs.AnyAsync(p =>
                p.UserId == userId &&
                p.ActivityId == activityId &&
                p.PingBatchIndex == currentBatchIndex);

            if (alreadyPinged) return false;

            var recent10 = emotionList.Skip(totalEmotions - 10).Take(10).ToList();
            int negativeCount = recent10.Count(e => e == "negative");

            if (negativeCount >= 5) // 50% threshold
            {
                _context.PingLogs.Add(new PingLog
                {
                    UserId = userId,
                    ActivityId = activityId,
                    PingBatchIndex = currentBatchIndex
                });
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}

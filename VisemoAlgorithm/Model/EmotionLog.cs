namespace VisemoAlgorithm.Model
{
    public class EmotionLog
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public int ActivityId { get; set; }

        public string DetectedEmotion { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

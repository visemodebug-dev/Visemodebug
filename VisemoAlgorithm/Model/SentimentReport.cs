namespace VisemoAlgorithm.Model
{
    public class SentimentReport
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
        public double SentimentScore { get; set; }
        public double FinalEmotionScore { get; set; }
        public double AverageEmotionScore { get; set; }
        public double BuildSuccessRate { get; set; }
        public int SelfAssessmentPenalty { get; set; } // 1 or 0
        public string Interpretation { get; set; }
    }
}

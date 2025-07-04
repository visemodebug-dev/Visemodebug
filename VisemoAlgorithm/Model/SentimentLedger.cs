using System.ComponentModel.DataAnnotations;

namespace VisemoAlgorithm.Model
{
    public class SentimentLedger
    {
        [Key]
        public int LedgerId { get; set; }

        public bool BuildResult { get; set; }

        
        public string ImageCaptured { get; set; }

        
        public string EmotionDetected { get; set; }

        
        public DateTime CapturedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public int ClassroomId { get; set; }
        public int ClassroomActivityId { get; set; }

        public StudentSentimentSummary StudentSentimentSummary { get; set; }
        public SelfAssessment SelfAssessment { get; set; }
    }
}

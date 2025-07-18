namespace VisemoAlgorithm.Model
{
    public class ActivitySession
    {
        public int Id { get; set; }
        public int ActivityId { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; } = DateTime.UtcNow;
    }
}

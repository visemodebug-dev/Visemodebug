namespace VisemoServices.Model
{
    public class Activity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public TimeSpan Timer { get; set; }  // Duration of the activity
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Optional: Link to a Classroom
        public int ClassroomId { get; set; }
        public Classroom Classroom { get; set; }
    }

}

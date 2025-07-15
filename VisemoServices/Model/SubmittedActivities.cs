namespace VisemoServices.Model
{
    public class SubmittedActivities
    {
        public int Id { get; set; }
        public string code { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
    }
}

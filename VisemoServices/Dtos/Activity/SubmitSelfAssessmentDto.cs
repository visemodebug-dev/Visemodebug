namespace VisemoServices.Dtos.Activity
{
    public class SubmitSelfAssessmentDto
    {
        public string Reasons { get; set; } = string.Empty;
        public bool HasConcerns { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
    }
}

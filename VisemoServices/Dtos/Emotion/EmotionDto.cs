namespace VisemoServices.Dtos.Emotion
{
    public class EmotionUploadDto
    {
        public IFormFile Image { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
    }
}

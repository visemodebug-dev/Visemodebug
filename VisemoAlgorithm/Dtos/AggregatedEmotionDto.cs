namespace VisemoAlgorithm.Dtos
{
    public class AggregatedEmotionDto
    {
        public int ActivityId { get; set; }
        public int TotalPositiveEmotions { get; set; }
        public int TotalNegativeEmotions { get; set; }
        public int TotalNeutralEmotions { get; set; }
    }
}

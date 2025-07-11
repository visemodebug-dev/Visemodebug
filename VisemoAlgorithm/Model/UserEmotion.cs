namespace VisemoAlgorithm.Model
{
    public class UserEmotion
    {
        public int Id { get; set; }

        public int UserId { get; set; } // This matches the User.Id in VisemoDb
        public int ActivityId { get; set; }

        public int PositiveEmotions { get; set; } = 0;  
        public int NegativeEmotions { get; set; } = 0;
        public int NeutralEmotions { get; set; } = 0;

    }

}

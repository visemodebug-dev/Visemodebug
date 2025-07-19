using System.ComponentModel.DataAnnotations;

namespace VisemoServices.Model
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(255)]  
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required, MaxLength(100)]
        public string? firstName { get; set; }

        [Required, MaxLength(1)]
        public string? middleInitial { get; set; }

        [Required, MaxLength(100)]
        public string? lastName { get; set; }

        [Required, MaxLength(50)]
        public string? idNumber { get; set; }

        //[Required, MaxLength(255)]
        //public string? idImage { get; set; }

        [Required, MaxLength(10)]
        public string? role { get; set; }


        //Foreign key to Classroom
        public List<Classroom> Classrooms { get; set; } = new List<Classroom>();
    }

}

using System.ComponentModel.DataAnnotations;

namespace VisemoServices.Model
{
    public class Classroom
    {
        public Classroom()
        {
            Users = new List<User>();
        }
        public int Id { get; set; }
        public string? className { get; set; }

        // Foreign key to User and Activity
        public List<User> Users { get; set; } = new List<User>();
        public List<Activity> Activities { get; set; } = new List<Activity>();
    }
}

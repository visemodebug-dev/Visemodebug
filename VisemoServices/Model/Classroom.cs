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

        public List<User> Users { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VisemoAlgorithm.Model
{
    public class SelfAssessment
    {
        public int Id { get; set; }

        public string Reasons { get; set; }

        public bool hasConcerns { get; set; }

        public int UserId { get; set; }
        public int ActivityId { get; set; }
    }
}

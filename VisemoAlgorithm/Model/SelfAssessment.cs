using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VisemoAlgorithm.Model
{
    public class SelfAssessment
    {
        [Key, ForeignKey("SentimentLedger")]
        public int LedgerActivityId { get; set; }

        public string Reason { get; set; }

        public bool IsAffected { get; set; }

        public SentimentLedger SentimentLedger { get; set; }
    }
}

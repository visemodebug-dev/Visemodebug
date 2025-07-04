using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VisemoAlgorithm.Model
{
    public class StudentSentimentSummary
    {
        [Key, ForeignKey("SentimentLedger")]
        public int LedgerActivityId { get; set; }

        public string DetailedReport { get; set; }

        public SentimentLedger SentimentLedger { get; set; }
    }
}

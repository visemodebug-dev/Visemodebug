using VisemoAlgorithm.Data;
using VisemoAlgorithm.Model;

namespace VisemoAlgorithm.Service
{
    public class SelfAssessmentService
    {
        private readonly VisemoAlgoDbContext _context;

        public SelfAssessmentService(VisemoAlgoDbContext context)
        {
            _context = context;
        }

        public async Task<SelfAssessment> SaveSelfAssessment(string reasons, bool hasConcerns, int userId, int activityId)
        {
            var selfAssessment = new SelfAssessment
            {
                Reasons = reasons,
                hasConcerns = hasConcerns,
                UserId = userId,
                ActivityId = activityId
            };

            _context.SelfAssessments.Add(selfAssessment);
            await _context.SaveChangesAsync();

            return selfAssessment;
        }
    }
}


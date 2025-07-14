using Microsoft.EntityFrameworkCore;
using VisemoAlgorithm.Data;
using VisemoAlgorithm.Model;

namespace VisemoAlgorithm.Service
{
    public class CodeEditorServices
    {
        private readonly VisemoAlgoDbContext _context;

        public CodeEditorServices(VisemoAlgoDbContext context)
        {
            _context = context;
        }

        public async Task<BuildResult> SubmitBuild(bool isSuccessful, int userId, int activityId)
        {
            var buildResult = new BuildResult
            {
                IsSuccessful = isSuccessful,
                UserId = userId,
                ActivityId = activityId
            };

            _context.BuildResults.Add(buildResult);
            await _context.SaveChangesAsync();

            return buildResult;
        }
    }
}

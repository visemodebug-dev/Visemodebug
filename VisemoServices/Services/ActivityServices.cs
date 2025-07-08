using Microsoft.EntityFrameworkCore;
using VisemoServices.Data;
using VisemoServices.Model;

namespace VisemoServices.Services
{
    public class ActivityService : IActivityService
    {
        private readonly DatabaseContext _context;

        public ActivityService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Activity> CreateActivityAsync(int classroomId, string name, TimeSpan timer, string instruction)
        {
            var activity = new Activity
            {
                Name = name,
                Timer = timer,
                ClassroomId = classroomId,
                Instruction = instruction
            };

            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            return activity;
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByClassroomAsync(int classroomId)
        {
            return await _context.Activities
                .Where(a => a.ClassroomId == classroomId)
                .ToListAsync();
        }

        public async Task<Activity> GetActivityByIdAsync(int id)
        {
            return await _context.Activities.FindAsync(id);
        }

        public async Task DeleteActivityAsync(int id)
        {
            var activity = await _context.Activities.FindAsync(id);
            if (activity != null)
            {
                _context.Activities.Remove(activity);
                await _context.SaveChangesAsync();
            }
        }
    }

}

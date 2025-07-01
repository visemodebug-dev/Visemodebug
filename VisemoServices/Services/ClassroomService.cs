using Microsoft.EntityFrameworkCore;
using VisemoServices.Data;
using VisemoServices.Model;

namespace VisemoServices.Services
{

    public class ClassroomService : IClassroomService
    {
        private readonly DatabaseContext _context;

        public ClassroomService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Classroom> CreateClassroomAsync(string name)
        {
            var classroom = new Classroom
            {
                className = name,
                Activities = new List<Activity>()
            };

            _context.Classrooms.Add(classroom);
            await _context.SaveChangesAsync();

            return classroom;
        }

        public async Task<IEnumerable<Classroom>> GetAllClassroomsAsync()
        {
            return await _context.Classrooms
                .Include(c => c.Activities) // Optional: load activities with classroom
                .ToListAsync();
        }

        public async Task<Classroom> GetClassroomByIdAsync(int id)
        {
            return await _context.Classrooms
                .Include(c => c.Activities) // Optional
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Classroom> UpdateClassroomAsync(int id, string newName)
        {
            var classroom = await _context.Classrooms.FindAsync(id);
            if (classroom == null) return null;

            classroom.className = newName;
            await _context.SaveChangesAsync();

            return classroom;
        }

        public async Task DeleteClassroomAsync(int id)
        {
            var classroom = await _context.Classrooms.FindAsync(id);
            if (classroom != null)
            {
                _context.Classrooms.Remove(classroom);
                await _context.SaveChangesAsync();
            }
        }
    }
}

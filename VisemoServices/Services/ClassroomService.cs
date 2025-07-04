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
        public async Task<(bool Success, string Message)> AddUserToClassroomAsync(int classroomId, int userId)
        {
            var classroom = await _context.Classrooms.Include(c => c.Users)
                                                      .FirstOrDefaultAsync(c => c.Id == classroomId);
            if (classroom == null) return (false, "Classroom not found");

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return (false, "User not found");

            if (classroom.Users.Any(u => u.Id == userId))
                return (false, "User already in classroom");

            classroom.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, "User added to classroom successfully");
        }

        public async Task<IEnumerable<object>?> GetUsersInClassroomAsync(int classroomId)
        {
            var classroom = await _context.Classrooms
                                          .Include(c => c.Users)
                                          .FirstOrDefaultAsync(c => c.Id == classroomId);

            if (classroom == null) return null;

            return classroom.Users.Select(u => new
            {
                u.Id,
                u.Email,
                u.firstName,
                u.lastName,
                u.idNumber
            });
        }
        public async Task<(bool Success, string Message)> RemoveUserFromClassroomAsync(int classroomId, int userId)
        {
            var classroom = await _context.Classrooms
                                          .Include(c => c.Users)
                                          .FirstOrDefaultAsync(c => c.Id == classroomId);

            if (classroom == null) return (false, "Classroom not found");

            var user = classroom.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return (false, "User not found in this classroom");

            classroom.Users.Remove(user);
            await _context.SaveChangesAsync();

            return (true, "User removed from classroom successfully");
        }
    }
}

using Microsoft.EntityFrameworkCore;
using VisemoServices.Data;
using VisemoServices.Model;
using VisemoServices.Dtos.Classroom;

namespace VisemoServices.Services
{

    public class ClassroomService : IClassroomService
    {
        private readonly DatabaseContext _context;

        public ClassroomService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<ClassroomResponseDto> CreateClassroomAsync(string name, int teacherUserId)
        {
            var teacher = await _context.Users.FindAsync(teacherUserId);

            if (teacher == null || teacher.role?.ToLower() != "teacher")
                throw new Exception("Invalid teacher ID");

            var classroom = new Classroom
            {
                className = name,
                Activities = new List<Activity>() // Keep this if you want an empty list initialized
            };

            // Associate classroom with the teacher
            teacher.Classrooms.Add(classroom);

            await _context.SaveChangesAsync();

            return new ClassroomResponseDto
            {
                Id = classroom.Id,
                className = classroom.className,
                teacherFullName = $"{teacher.firstName} {teacher.middleInitial}. {teacher.lastName}"
            };
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
        public async Task<(bool Success, string Message)> AddUserToClassroomAsync(int classroomId, string idNumber)
        {
            var classroom = await _context.Classrooms
                .Include(c => c.Users)
                .FirstOrDefaultAsync(c => c.Id == classroomId);

            if (classroom == null)
                return (false, "Classroom not found");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.idNumber == idNumber);
            if (user == null)
                return (false, "User with this ID number was not found");

            if (classroom.Users.Any(u => u.Id == user.Id))
                return (false, "User is already in this classroom");

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
        public async Task<(bool Success, string Message)> RemoveUserFromClassroomAsync(int classroomId, string idNumber)
        {
            var classroom = await _context.Classrooms
                                          .Include(c => c.Users)
                                          .FirstOrDefaultAsync(c => c.Id == classroomId);

            if (classroom == null)
                return (false, "Classroom not found");

            var user = classroom.Users.FirstOrDefault(u => u.idNumber == idNumber);
            if (user == null)
                return (false, "User with this ID number was not found in this classroom");

            classroom.Users.Remove(user);
            await _context.SaveChangesAsync();

            return (true, "User removed from classroom successfully");
        }
        public async Task<IEnumerable<object>> SearchUsersNotInClassroom(int classroomId, string partialIdNumber)
        {
            var classroom = await _context.Classrooms
                                          .Include(c => c.Users)
                                          .FirstOrDefaultAsync(c => c.Id == classroomId);

            if (classroom == null)
                return Enumerable.Empty<object>();

            // Get user IDs already in the classroom
            var userIdsInClassroom = classroom.Users.Select(u => u.Id).ToHashSet();

            // Get users not in the classroom and matching the partial idNumber
            var users = await _context.Users
                .Where(u => !userIdsInClassroom.Contains(u.Id) &&
                            u.idNumber.Contains(partialIdNumber))
                .Select(u => new
                {
                    u.Id,
                    u.firstName,
                    u.lastName,
                    u.Email,
                    u.idNumber
                })
                .ToListAsync();

            return users;
        }

    }
}

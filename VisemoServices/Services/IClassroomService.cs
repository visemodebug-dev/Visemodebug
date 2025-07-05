using VisemoServices.Model;

namespace VisemoServices.Services
{
    public interface IClassroomService
    {
        Task<Classroom> CreateClassroomAsync(string name);
        Task<IEnumerable<Classroom>> GetAllClassroomsAsync();
        Task<Classroom> GetClassroomByIdAsync(int id);
        Task<Classroom> UpdateClassroomAsync(int id, string newName);
        Task DeleteClassroomAsync(int id);
        Task<(bool Success, string Message)> AddUserToClassroomAsync(int classroomId, int userId);
        Task<IEnumerable<object>?> GetUsersInClassroomAsync(int classroomId);
        Task<(bool Success, string Message)> RemoveUserFromClassroomAsync(int classroomId, int userId);
        Task<IEnumerable<object>> SearchUsersNotInClassroom(int classroomId, string partialIdNumber);

    }
}

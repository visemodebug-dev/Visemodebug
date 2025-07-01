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
    }
}

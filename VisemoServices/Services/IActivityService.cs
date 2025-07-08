using VisemoServices.Model;
namespace VisemoServices.Services


{
    public interface IActivityService
    {
        Task<Activity> CreateActivityAsync(int classroomId, string name, TimeSpan timer, string instruction);
        Task<IEnumerable<Activity>> GetActivitiesByClassroomAsync(int classroomId);
        Task<Activity> GetActivityByIdAsync(int id);
        Task DeleteActivityAsync(int id);
    }

}

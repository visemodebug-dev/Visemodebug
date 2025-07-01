using Microsoft.AspNetCore.Mvc;
using VisemoServices.Services;

namespace VisemoServices.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivityController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateActivityDto dto)
        {
            var activity = await _activityService.CreateActivityAsync(dto.ClassroomId, dto.Name, dto.Timer);
            return Ok(activity);
        }

        [HttpGet("classroom/{classroomId}")]
        public async Task<IActionResult> GetByClassroom(int classroomId)
        {
            var activities = await _activityService.GetActivitiesByClassroomAsync(classroomId);
            return Ok(activities);
        }
    }

    public class CreateActivityDto
    {
        public int ClassroomId { get; set; }
        public string Name { get; set; }
        public TimeSpan Timer { get; set; }
    }

}

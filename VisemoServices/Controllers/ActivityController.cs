using Microsoft.AspNetCore.Mvc;
using VisemoServices.Services;
using VisemoServices.Dtos.Activity;

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

        [HttpPost("CreateActivity")]
        public async Task<IActionResult> Create([FromBody] CreateActivityDto dto)
        {
            var activity = await _activityService.CreateActivityAsync(dto.ClassroomId, dto.Name, dto.Timer, dto.Instruction);
            return Ok(activity);
        }

        [HttpGet("GetActivities")]
        public async Task<IActionResult> GetByClassroom(int classroomId)
        {
            var activities = await _activityService.GetActivitiesByClassroomAsync(classroomId);
            return Ok(activities);
        }
    }

}

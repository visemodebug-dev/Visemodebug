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

        [HttpGet("GetActivityById")]
        public async Task<IActionResult> GetActivtyById(int activityId)
        {
            var activity = await _activityService.GetActivityById(activityId);
            return Ok(activity);
        }

        [HttpPost("StartActivity")]
        public async Task<IActionResult> StartActivity(int activityId)
        {
            var result = await _activityService.StartActivity(activityId);
            if (!result.Success) return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        [HttpPost("StopActivity")]
        public async Task<IActionResult> StopActivity(int activityId)
        {
            var result = await _activityService.StopActivity(activityId);
            if (!result.Success) return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        [HttpPost("SubmitSelfAssessment")]
        public async Task<IActionResult> SubmitSelfAssessment([FromBody] SubmitSelfAssessmentDto dto)
        {
            var result = await _activityService.SubmitSelfAssessment(dto.UserId, dto.ActivityId, dto.Reasons, dto.HasConcerns);
            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

    }

}

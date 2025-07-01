using Microsoft.AspNetCore.Mvc;
using VisemoServices.Dtos;
using VisemoServices.Services;

namespace VisemoServices.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomController : ControllerBase
    {
        private readonly IClassroomService _classroomService;

        public ClassroomController(IClassroomService classroomService)
        {
            _classroomService = classroomService;
        }
        // Create Classroom
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClassroomDto dto)
        {
            var classroom = await _classroomService.CreateClassroomAsync(dto.Name);
            return Ok(classroom);
        }
        //Add User to Classroom
        [HttpPost("{id}/AddUser")]
        public async Task<IActionResult> AddUserToClassroom(int id, [FromBody] AddUserDto dto)
        {
            var result = await _classroomService.AddUserToClassroomAsync(id, dto.UserId);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        // Get all Classrooms
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var classrooms = await _classroomService.GetAllClassroomsAsync();
            return Ok(classrooms);
        }

        // Get Classroom by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var classroom = await _classroomService.GetClassroomByIdAsync(id);
            if (classroom == null) return NotFound();
            return Ok(classroom);
        }
        //Get Users in Classroom
        [HttpGet("{id}/Users")]
        public async Task<IActionResult> GetUsersInClassroom(int id)
        {
            var users = await _classroomService.GetUsersInClassroomAsync(id);
            if (users == null) return NotFound(new { message = "Classroom not found" });
            return Ok(users);
        }
        // Update Classroom
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClassroomDto dto)
        {
            var classroom = await _classroomService.UpdateClassroomAsync(id, dto.NewName);
            if (classroom == null) return NotFound();
            return Ok(classroom);
        }
        // Delete Classroom
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _classroomService.DeleteClassroomAsync(id);
            return NoContent();
        }
        // Remove user from classroom
        [HttpDelete("{classroomId}/RemoveUser/{userId}")]
        public async Task<IActionResult> RemoveUserFromClassroom(int classroomId, int userId)
        {
            var result = await _classroomService.RemoveUserFromClassroomAsync(classroomId, userId);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }
    }
}

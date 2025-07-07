using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VisemoServices.Dtos.Classroom;
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
        [Authorize(Roles = "Teacher")]
        [HttpPost("CreateClassroom")]
        public async Task<IActionResult> CreateClassroom([FromBody] CreateClassroomRequestDto request)
        {
            try
            {
                // Extract user ID from token
                var teacherUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

                var classroom = await _classroomService.CreateClassroomAsync(request.Name, teacherUserId);
                return Ok(classroom);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Add User to Classroom
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUserToClassroom(int classroomId, [FromBody] AddUserDto dto)
        {
            var result = await _classroomService.AddUserToClassroomAsync(classroomId, dto.idNumber);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        // Get all Classrooms
        [HttpGet("GetAllClassrooms")]
        public async Task<IActionResult> GetAll()
        {
            var classrooms = await _classroomService.GetAllClassroomsAsync();
            return Ok(classrooms);
        }

        // Get Classroom by ID
        [HttpGet("GetClassroom")]
        public async Task<IActionResult> GetById(int id)
        {
            var classroom = await _classroomService.GetClassroomByIdAsync(id);
            if (classroom == null) return NotFound();
            return Ok(classroom);
        }
        //Get Users in Classroom
        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUsersInClassroom(int id)
        {
            var users = await _classroomService.GetUsersInClassroomAsync(id);
            if (users == null) return NotFound(new { message = "Classroom not found" });
            return Ok(users);
        }
        // Update Classroom
        [HttpPut("UpdateClassroom")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClassroomDto dto)
        {
            var classroom = await _classroomService.UpdateClassroomAsync(id, dto.NewName);
            if (classroom == null) return NotFound();
            return Ok(classroom);
        }
        // Delete Classroom
        [HttpDelete("DeleteClassroom")]
        public async Task<IActionResult> Delete(int id)
        {
            await _classroomService.DeleteClassroomAsync(id);
            return NoContent();
        }
        // Remove user from classroom
        [HttpDelete("RemoveUser")]
        public async Task<IActionResult> RemoveUserFromClassroom(int classroomId, string idNumber)
        {
            var result = await _classroomService.RemoveUserFromClassroomAsync(classroomId, idNumber);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }
        //Search Query for User NOT in the current classroom
        [HttpGet("SearchUsers")]
        public async Task<IActionResult> SearchUsersNotInClassroom(int classroomId, [FromQuery] string idNumber)
        {
            var users = await _classroomService.SearchUsersNotInClassroom(classroomId, idNumber);
            return Ok(users);
        }

    }
}

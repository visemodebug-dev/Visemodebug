using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClassroomDto dto)
        {
            var classroom = await _classroomService.CreateClassroomAsync(dto.Name);
            return Ok(classroom);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var classrooms = await _classroomService.GetAllClassroomsAsync();
            return Ok(classrooms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var classroom = await _classroomService.GetClassroomByIdAsync(id);
            if (classroom == null) return NotFound();
            return Ok(classroom);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClassroomDto dto)
        {
            var classroom = await _classroomService.UpdateClassroomAsync(id, dto.NewName);
            if (classroom == null) return NotFound();
            return Ok(classroom);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _classroomService.DeleteClassroomAsync(id);
            return NoContent();
        }
    }

    public class CreateClassroomDto
    {
        public string Name { get; set; }
    }

    public class UpdateClassroomDto
    {
        public string NewName { get; set; }
    }

}

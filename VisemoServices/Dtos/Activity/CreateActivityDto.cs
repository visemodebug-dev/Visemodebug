namespace VisemoServices.Dtos.Activity
{
    public class CreateActivityDto
    {
        public int ClassroomId { get; set; }
        public string Name { get; set; }
        public TimeSpan Timer { get; set; }
        public string Instruction { get; set; }
    }
}

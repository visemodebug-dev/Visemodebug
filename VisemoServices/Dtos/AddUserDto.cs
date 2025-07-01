namespace VisemoServices.Dtos
{
    public class AddUserDto
    {
        public int UserId { get; set; }
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

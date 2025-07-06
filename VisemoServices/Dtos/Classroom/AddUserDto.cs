namespace VisemoServices.Dtos.Classroom
{
    public class AddUserDto
    {
        public string idNumber { get; set; }
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

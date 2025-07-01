using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VisemoServices.Migrations
{
    /// <inheritdoc />
    public partial class AddClassroomUserRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Classrooms_ClassroomId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ClassroomId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ClassroomId",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "ClassroomUser",
                columns: table => new
                {
                    ClassroomsId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassroomUser", x => new { x.ClassroomsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ClassroomUser_Classrooms_ClassroomsId",
                        column: x => x.ClassroomsId,
                        principalTable: "Classrooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassroomUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ClassroomUser_UsersId",
                table: "ClassroomUser",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassroomUser");

            migrationBuilder.AddColumn<int>(
                name: "ClassroomId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ClassroomId",
                table: "Users",
                column: "ClassroomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Classrooms_ClassroomId",
                table: "Users",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VisemoServices.Migrations
{
    /// <inheritdoc />
    public partial class AddIsStartedToActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsStarted",
                table: "Activities",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsStarted",
                table: "Activities");
        }
    }
}

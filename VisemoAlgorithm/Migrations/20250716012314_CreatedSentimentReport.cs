using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VisemoAlgorithm.Migrations
{
    /// <inheritdoc />
    public partial class CreatedSentimentReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SentimentReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ActivityId = table.Column<int>(type: "int", nullable: false),
                    SentimentScore = table.Column<double>(type: "double", nullable: false),
                    FinalEmotionScore = table.Column<double>(type: "double", nullable: false),
                    AverageEmotionScore = table.Column<double>(type: "double", nullable: false),
                    BuildSuccessRate = table.Column<double>(type: "double", nullable: false),
                    SelfAssessmentPenalty = table.Column<int>(type: "int", nullable: false),
                    Interpretation = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentimentReports", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SentimentReports");
        }
    }
}

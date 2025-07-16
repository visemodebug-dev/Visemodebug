using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VisemoAlgorithm.Migrations
{
    /// <inheritdoc />
    public partial class CreatedEmotionLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentSentimentSummary");

            migrationBuilder.DropTable(
                name: "SentimentLedger");

            migrationBuilder.CreateTable(
                name: "EmotionLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ActivityId = table.Column<int>(type: "int", nullable: false),
                    DetectedEmotion = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmotionLogs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmotionLogs");

            migrationBuilder.CreateTable(
                name: "SentimentLedger",
                columns: table => new
                {
                    LedgerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SelfAssessmentId = table.Column<int>(type: "int", nullable: false),
                    BuildResult = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CapturedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ClassroomActivityId = table.Column<int>(type: "int", nullable: false),
                    ClassroomId = table.Column<int>(type: "int", nullable: false),
                    EmotionDetected = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentimentLedger", x => x.LedgerId);
                    table.ForeignKey(
                        name: "FK_SentimentLedger_SelfAssessment_SelfAssessmentId",
                        column: x => x.SelfAssessmentId,
                        principalTable: "SelfAssessment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StudentSentimentSummary",
                columns: table => new
                {
                    LedgerActivityId = table.Column<int>(type: "int", nullable: false),
                    DetailedReport = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentSentimentSummary", x => x.LedgerActivityId);
                    table.ForeignKey(
                        name: "FK_StudentSentimentSummary_SentimentLedger_LedgerActivityId",
                        column: x => x.LedgerActivityId,
                        principalTable: "SentimentLedger",
                        principalColumn: "LedgerId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SentimentLedger_SelfAssessmentId",
                table: "SentimentLedger",
                column: "SelfAssessmentId");
        }
    }
}

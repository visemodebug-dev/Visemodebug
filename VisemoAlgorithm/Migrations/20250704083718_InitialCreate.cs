using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VisemoAlgorithm.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SentimentLedger",
                columns: table => new
                {
                    LedgerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BuildResult = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ImageCaptured = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmotionDetected = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CapturedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ClassroomId = table.Column<int>(type: "int", nullable: false),
                    ClassroomActivityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentimentLedger", x => x.LedgerId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SelfAssessment",
                columns: table => new
                {
                    LedgerActivityId = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAffected = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SelfAssessment", x => x.LedgerActivityId);
                    table.ForeignKey(
                        name: "FK_SelfAssessment_SentimentLedger_LedgerActivityId",
                        column: x => x.LedgerActivityId,
                        principalTable: "SentimentLedger",
                        principalColumn: "LedgerId",
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SelfAssessment");

            migrationBuilder.DropTable(
                name: "StudentSentimentSummary");

            migrationBuilder.DropTable(
                name: "SentimentLedger");
        }
    }
}

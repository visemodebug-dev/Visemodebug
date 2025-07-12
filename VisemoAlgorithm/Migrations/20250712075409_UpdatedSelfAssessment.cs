using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VisemoAlgorithm.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedSelfAssessment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SelfAssessment_SentimentLedger_LedgerActivityId",
                table: "SelfAssessment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SelfAssessment",
                table: "SelfAssessment");

            migrationBuilder.RenameColumn(
                name: "Reason",
                table: "SelfAssessment",
                newName: "Reasons");

            migrationBuilder.RenameColumn(
                name: "IsAffected",
                table: "SelfAssessment",
                newName: "hasConcerns");

            migrationBuilder.RenameColumn(
                name: "LedgerActivityId",
                table: "SelfAssessment",
                newName: "UserId");

            migrationBuilder.AddColumn<int>(
                name: "SelfAssessmentId",
                table: "SentimentLedger",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "SelfAssessment",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<int>(
                name: "ActivityId",
                table: "SelfAssessment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SelfAssessment",
                table: "SelfAssessment",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_SentimentLedger_SelfAssessmentId",
                table: "SentimentLedger",
                column: "SelfAssessmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SentimentLedger_SelfAssessment_SelfAssessmentId",
                table: "SentimentLedger",
                column: "SelfAssessmentId",
                principalTable: "SelfAssessment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SentimentLedger_SelfAssessment_SelfAssessmentId",
                table: "SentimentLedger");

            migrationBuilder.DropIndex(
                name: "IX_SentimentLedger_SelfAssessmentId",
                table: "SentimentLedger");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SelfAssessment",
                table: "SelfAssessment");

            migrationBuilder.DropColumn(
                name: "SelfAssessmentId",
                table: "SentimentLedger");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "SelfAssessment");

            migrationBuilder.DropColumn(
                name: "ActivityId",
                table: "SelfAssessment");

            migrationBuilder.RenameColumn(
                name: "hasConcerns",
                table: "SelfAssessment",
                newName: "IsAffected");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "SelfAssessment",
                newName: "LedgerActivityId");

            migrationBuilder.RenameColumn(
                name: "Reasons",
                table: "SelfAssessment",
                newName: "Reason");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SelfAssessment",
                table: "SelfAssessment",
                column: "LedgerActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_SelfAssessment_SentimentLedger_LedgerActivityId",
                table: "SelfAssessment",
                column: "LedgerActivityId",
                principalTable: "SentimentLedger",
                principalColumn: "LedgerId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

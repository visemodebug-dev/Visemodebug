using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using VisemoAlgorithm.Model;

namespace VisemoAlgorithm.Data
{
    public class VisemoAlgoDbContext : DbContext
    {
        public VisemoAlgoDbContext(DbContextOptions<VisemoAlgoDbContext> options) : base(options) { }

        public DbSet<SentimentLedger> SentimentLedgers { get; set; }
        public DbSet<StudentSentimentSummary> StudentSentimentSummaries { get; set; }
        public DbSet<SelfAssessment> SelfAssessments { get; set; }
        public DbSet<UserEmotion> UserEmotions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SentimentLedger>()
                .ToTable("SentimentLedger");

            modelBuilder.Entity<StudentSentimentSummary>()
                .ToTable("StudentSentimentSummary");

            modelBuilder.Entity<SelfAssessment>()
                .ToTable("SelfAssessment");

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserEmotion>()
            .HasKey(e => e.Id);

            // Simulate foreign key, but not enforced
            modelBuilder.Entity<UserEmotion>()
                .Property(e => e.UserId)
                .IsRequired();
        }
    }
}

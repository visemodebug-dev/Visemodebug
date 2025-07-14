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
        public DbSet<BuildResult> BuildResults { get; set; }

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

            modelBuilder.Entity<UserEmotion>()
                .Property(e => e.ActivityId)
                .IsRequired();

            modelBuilder.Entity<SelfAssessment>()
            .HasKey(s => s.Id);

            // Simulate foreign key, but not enforced
            modelBuilder.Entity<SelfAssessment>()
                .Property(s => s.UserId)
                .IsRequired();

            modelBuilder.Entity<SelfAssessment>()
                .Property(s => s.ActivityId)
                .IsRequired();

            modelBuilder.Entity<BuildResult>()
            .HasKey(b => b.Id);

            // Simulate foreign key, but not enforced
            modelBuilder.Entity<BuildResult>()
                .Property(b => b.UserId)
                .IsRequired();

            modelBuilder.Entity<BuildResult>()
                .Property(b => b.ActivityId)
                .IsRequired();
        }
    }
}

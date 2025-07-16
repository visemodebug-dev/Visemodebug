using VisemoAlgorithm.Data;
using VisemoAlgorithm.Model;
using Microsoft.EntityFrameworkCore;

namespace VisemoAlgorithm.Service
{
    public class SentimentScoringService
    {
        private readonly VisemoAlgoDbContext _context;

        public SentimentScoringService(VisemoAlgoDbContext context)
        {
            _context = context;
        }

        public async Task<SentimentReport> GenerateSentimentReportAsync(int userId, int activityId)
        {
            var emotions = await _context.UserEmotions.FirstOrDefaultAsync(e => e.UserId == userId && e.ActivityId == activityId);
            var builds = await _context.BuildResults
                .Where(b => b.UserId == userId && b.ActivityId == activityId)
                .ToListAsync();
            var self = await _context.SelfAssessments
                .FirstOrDefaultAsync(s => s.UserId == userId && s.ActivityId == activityId);

            if (emotions == null || builds.Count == 0 || self == null)
                throw new Exception("Incomplete data for sentiment scoring");

            // Compute mapped scores
            int total = emotions.PositiveEmotions + emotions.NegativeEmotions + emotions.NeutralEmotions;
            double Ē = (1.0 / (total == 0 ? 1 : total)) * (
                (emotions.PositiveEmotions * 1) +
                (emotions.NeutralEmotions * 0) +
                (emotions.NegativeEmotions * -1)
            );

            // Final emotion is approximated by the category with highest count
            double E_final = 0;
            if (emotions.PositiveEmotions >= emotions.NegativeEmotions &&
                emotions.PositiveEmotions >= emotions.NeutralEmotions)
                E_final = 1;
            else if (emotions.NegativeEmotions >= emotions.PositiveEmotions &&
                     emotions.NegativeEmotions >= emotions.NeutralEmotions)
                E_final = -1;

            double B = (double)builds.Count(b => b.IsSuccessful) / builds.Count;
            int P = self.hasConcerns ? 1 : 0;

            // Weights
            double a = 0.3, b = 0.4, c = 0.3, γ = 0.3;

            double S = (a * Ē) + (b * E_final) + (c * B) - (γ * P);
            string interpretation = GetInterpretation(E_final, Ē, B, P);

            var report = new SentimentReport
            {
                UserId = userId,
                ActivityId = activityId,
                SentimentScore = S,
                FinalEmotionScore = E_final,
                AverageEmotionScore = Ē,
                BuildSuccessRate = B,
                SelfAssessmentPenalty = P,
                Interpretation = interpretation
            };

            _context.SentimentReports.Add(report);
            await _context.SaveChangesAsync();

            return report;
        }

        private string GetInterpretation(double final, double avg, double build, double penalty)
        {
            // Emotion Flags
            bool isFinalPositive = final > 0;
            bool isFinalNeutral = final == 0;
            bool isFinalNegative = final < 0;

            bool isAvgPositive = avg > 0;
            bool isAvgNeutral = avg == 0;
            bool isAvgNegative = avg < 0;

            // Build Flags
            bool isBuildHigh = build > 0.7;
            bool isBuildLow = build < 0.5;
            bool isBuildMixed = build >= 0.5 && build <= 0.7;

            // Self-Assessment
            bool hasPenalty = penalty == 1;
            bool noPenalty = penalty == 0;

            // 54 permutations
            if (isFinalPositive && isAvgPositive && isBuildHigh && noPenalty)
                return "The student shows high performance and emotional engagement without external hindrances. A strong indication of mastery and well-being.";

            if (isFinalPositive && isAvgPositive && isBuildHigh && hasPenalty)
                return "The student performs strongly and remains positive despite external challenges, suggesting resilience.";

            if (isFinalPositive && isAvgPositive && isBuildMixed && noPenalty)
                return "The student maintains positive emotions and moderate performance, showing promise.";

            if (isFinalPositive && isAvgPositive && isBuildMixed && hasPenalty)
                return "The student shows positivity and resilience, though support may still help optimize performance.";

            if (isFinalPositive && isAvgPositive && isBuildLow && noPenalty)
                return "The student is emotionally positive but struggles technically. May benefit from technical guidance.";

            if (isFinalPositive && isAvgPositive && isBuildLow && hasPenalty)
                return "The student remains emotionally engaged despite challenges. External factors may be impacting progress.";

            if (isFinalPositive && isAvgNeutral && isBuildHigh && noPenalty)
                return "Strong performance with stable emotional state. The student appears focused and capable.";

            if (isFinalPositive && isAvgNeutral && isBuildHigh && hasPenalty)
                return "Student performs well despite emotional detachment or external concerns.";

            if (isFinalPositive && isAvgNeutral && isBuildMixed && noPenalty)
                return "Moderate technical output with signs of optimism. Student is progressing.";

            if (isFinalPositive && isAvgNeutral && isBuildMixed && hasPenalty)
                return "Mixed build outcomes and stable emotions. External issues may slightly hinder performance.";

            if (isFinalPositive && isAvgNeutral && isBuildLow && noPenalty)
                return "Positive outlook despite technical difficulty. Encouraging but requires follow-up.";

            if (isFinalPositive && isAvgNeutral && isBuildLow && hasPenalty)
                return "Emotional positivity contrasts with poor technical results and self-reported issues. May need intervention.";

            if (isFinalPositive && isAvgNegative && isBuildHigh && noPenalty)
                return "Final positivity contrasts with earlier emotional difficulties. The student may have overcome initial struggles.";

            if (isFinalPositive && isAvgNegative && isBuildHigh && hasPenalty)
                return "The student concludes well despite earlier emotional and external challenges, indicating resilience.";

            if (isFinalPositive && isAvgNegative && isBuildMixed && noPenalty)
                return "A mix of emotions and performance, ending on a positive note. Monitor progress.";

            if (isFinalPositive && isAvgNegative && isBuildMixed && hasPenalty)
                return "Positivity at the end but underlying challenges remain. Encourage support.";

            if (isFinalPositive && isAvgNegative && isBuildLow && noPenalty)
                return "Emotionally improving but still technically struggling. Follow-up is suggested.";

            if (isFinalPositive && isAvgNegative && isBuildLow && hasPenalty)
                return "End positivity overshadowed by persistent technical and emotional issues. Recommend close guidance.";

            if (isFinalNeutral && isAvgPositive && isBuildHigh && noPenalty)
                return "The student performs well with a neutral emotional ending. Consistent and stable performance.";

            if (isFinalNeutral && isAvgPositive && isBuildHigh && hasPenalty)
                return "Stable performance with some external stress. The student is managing well.";

            if (isFinalNeutral && isAvgPositive && isBuildMixed && noPenalty)
                return "Positive trajectory with emotional flattening. Continue to motivate.";

            if (isFinalNeutral && isAvgPositive && isBuildMixed && hasPenalty)
                return "External issues may affect consistency, despite a positive background.";

            if (isFinalNeutral && isAvgPositive && isBuildLow && noPenalty)
                return "Neutral end with emotional optimism. Technical help may be necessary.";

            if (isFinalNeutral && isAvgPositive && isBuildLow && hasPenalty)
                return "Positivity impacted by technical and external concerns. Suggest dual support.";

            if (isFinalNeutral && isAvgNeutral && isBuildHigh && noPenalty)
                return "Stable performance and emotions. Student appears consistent.";

            if (isFinalNeutral && isAvgNeutral && isBuildHigh && hasPenalty)
                return "Neutral pattern with good technical results. Minor external influences.";

            if (isFinalNeutral && isAvgNeutral && isBuildMixed && noPenalty)
                return "Moderate engagement and performance. Monitoring may be needed.";

            if (isFinalNeutral && isAvgNeutral && isBuildMixed && hasPenalty)
                return "Stable yet affected by external factors. Check-in recommended.";

            if (isFinalNeutral && isAvgNeutral && isBuildLow && noPenalty)
                return "Low technical results with neutral emotion. Needs support.";

            if (isFinalNeutral && isAvgNeutral && isBuildLow && hasPenalty)
                return "Neutral emotion with technical struggles and external issues. Prioritize intervention.";

            if (isFinalNeutral && isAvgNegative && isBuildHigh && noPenalty)
                return "Emotional difficulties did not hinder strong performance. Student may need emotional support.";

            if (isFinalNeutral && isAvgNegative && isBuildHigh && hasPenalty)
                return "Despite emotional and external challenges, student shows technical competence.";

            if (isFinalNeutral && isAvgNegative && isBuildMixed && noPenalty)
                return "Average emotional downturn, moderate output. Monitor closely.";

            if (isFinalNeutral && isAvgNegative && isBuildMixed && hasPenalty)
                return "Low emotions and outside concerns are affecting consistency. Support suggested.";

            if (isFinalNeutral && isAvgNegative && isBuildLow && noPenalty)
                return "Struggles are evident despite emotional neutrality at end. Follow-up needed.";

            if (isFinalNeutral && isAvgNegative && isBuildLow && hasPenalty)
                return "Low engagement across all aspects. Recommend full intervention.";

            if (isFinalNegative && isAvgPositive && isBuildHigh && noPenalty)
                return "Performance remains high despite emotional downturn at end. Temporary issue likely.";

            if (isFinalNegative && isAvgPositive && isBuildHigh && hasPenalty)
                return "Strong performance but emotional and external stress may be rising.";

            if (isFinalNegative && isAvgPositive && isBuildMixed && noPenalty)
                return "Good emotional start but mood dropped. Keep engaged and check in.";

            if (isFinalNegative && isAvgPositive && isBuildMixed && hasPenalty)
                return "External issues may explain mood shift. Encourage support.";

            if (isFinalNegative && isAvgPositive && isBuildLow && noPenalty)
                return "Poor technical output may be affecting emotion. Assist student.";

            if (isFinalNegative && isAvgPositive && isBuildLow && hasPenalty)
                return "Positivity overshadowed by technical and external difficulties. Strong support needed.";

            if (isFinalNegative && isAvgNeutral && isBuildHigh && noPenalty)
                return "Student ends negatively but performs well. Check for late emotional dips.";

            if (isFinalNegative && isAvgNeutral && isBuildHigh && hasPenalty)
                return "Student is technically sound, but emotional and external factors present late concern.";

            if (isFinalNegative && isAvgNeutral && isBuildMixed && noPenalty)
                return "Moderate output, with emotional drop. Needs encouragement.";

            if (isFinalNegative && isAvgNeutral && isBuildMixed && hasPenalty)
                return "Mood decline and mixed performance under stress. Intervention may help.";

            if (isFinalNegative && isAvgNeutral && isBuildLow && noPenalty)
                return "Emotional decline aligns with technical issues. Offer support.";

            if (isFinalNegative && isAvgNeutral && isBuildLow && hasPenalty)
                return "Multiple negative signals present. Recommend immediate attention.";

            if (isFinalNegative && isAvgNegative && isBuildHigh && noPenalty)
                return "Strong performance despite emotional instability. Monitor well-being.";

            if (isFinalNegative && isAvgNegative && isBuildHigh && hasPenalty)
                return "Technically capable but emotionally and externally burdened. Intervention advised.";

            if (isFinalNegative && isAvgNegative && isBuildMixed && noPenalty)
                return "Student faces emotional challenges. Performance is inconsistent. Needs encouragement.";

            if (isFinalNegative && isAvgNegative && isBuildMixed && hasPenalty)
                return "Multiple concerns affect both emotion and output. Recommend multi-angle support.";

            if (isFinalNegative && isAvgNegative && isBuildLow && noPenalty)
                return "Overall disengagement and poor performance. Requires support.";

            if (isFinalNegative && isAvgNegative && isBuildLow && hasPenalty)
                return "Critical case: negative emotional, technical, and self-reported signs. Urgent support required.";

            return "Sentiment could not be determined confidently. Please verify input data.";
        }



    }
}

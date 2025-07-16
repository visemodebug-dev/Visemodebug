using VisemoServices.Model;
using VisemoAlgorithm.Model;
using VisemoAlgorithm.Dtos;

namespace VisemoServices.Services
{
    public interface IEmotionServices
    {

        Task<(UserEmotion, string Emotion)>PredictEmotionAsync(IFormFile imageFile, int userId, int activityId);
        Task<AggregatedEmotionDto> AggregateEmotions(int activityId);
    }
}

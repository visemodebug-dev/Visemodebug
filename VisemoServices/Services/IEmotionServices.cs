using VisemoServices.Model;
using VisemoAlgorithm.Model;

namespace VisemoServices.Services
{
    public interface IEmotionServices
    {

        Task<(UserEmotion, string Emotion)>PredictEmotionAsync(IFormFile imageFile, int userId, int activityId);
    }
}

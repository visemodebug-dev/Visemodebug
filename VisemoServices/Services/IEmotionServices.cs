namespace VisemoServices.Services
{
    public interface IEmotionServices : IDisposable
    {
        //Task<float[]> Predict(float[] inputData); for frontend

        //Task<float[]> PredictImageAsync(IFormFile imageFile);

        Task<string> DetectEmotionAsync(byte[] imageBytes);
    }
}

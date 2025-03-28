using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using static System.Net.Mime.MediaTypeNames;

namespace VisemoServices.Services
{
    public class EmotionServices : IEmotionServices
    {
        private readonly InferenceSession _session;

        public EmotionServices()
        {
            // Load the ONNX model once
            string modelPath = "VisemoServices/Model/emotion.onnx"; // Adjust path if needed
            _session = new InferenceSession(modelPath);
        }

        // Predict the emotion from the input data
        // For frontend integration
        //public async Task<float[]> Predict(float[] inputData)
        //{
        //    return await Task.Run(() =>
        //    {
        //        if (inputData == null || inputData.Length == 0)
        //            throw new ArgumentException("Invalid input data.");

        //        var inputTensor = new DenseTensor<float>(inputData, new int[] { 1, inputData.Length });
        //        var inputs = new List<NamedOnnxValue>
        //        {
        //            NamedOnnxValue.CreateFromTensor("resnet50_input", inputTensor)
        //        };

        //        using var results = _session.Run(inputs);
        //        return results.First().AsEnumerable<float>().ToArray();
        //    });
        //}

        //// Dispose the session when done
        //public void Dispose()
        //{
        //    _session.Dispose();
        //}

        public async Task<float[]> PredictImageAsync(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                throw new ArgumentException("Invalid image file.");

            using var stream = new MemoryStream();
            await imageFile.CopyToAsync(stream);
            byte[] imageBytes = stream.ToArray();

            // Process the image into a tensor
            var inputTensor = ProcessImage(imageBytes);

            var inputs = new List<NamedOnnxValue>
            {
                NamedOnnxValue.CreateFromTensor("resnet50_input", inputTensor)
            };

            // Run inference
            using var results = _session.Run(inputs);
            return results.First().AsEnumerable<float>().ToArray();
        }
        
        private DenseTensor<float> ProcessImage(byte[] imageBytes)
        {
            using var image = SixLabors.ImageSharp.Image.Load<Rgb24>(imageBytes);
            image.Mutate(x => x.Resize(640, 640));  // Adjust to YOLO model input size

            float[] imageData = new float[640 * 640 * 3];
            int index = 0;

            for (int y = 0; y < 640; y++)
            {
                for (int x = 0; x < 640; x++)
                {
                    var pixel = image[x, y];
                    imageData[index++] = pixel.R / 255.0f; // Normalize to [0,1]
                    imageData[index++] = pixel.G / 255.0f;
                    imageData[index++] = pixel.B / 255.0f;
                }
            }

            return new DenseTensor<float>(imageData, new int[] { 1, 3, 640, 640 });
        }

        public void Dispose()
        {
            _session.Dispose();
        }
    }
}

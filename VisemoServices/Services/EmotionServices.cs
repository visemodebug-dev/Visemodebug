using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using static System.Net.Mime.MediaTypeNames;
using SixLabors.ImageSharp;


namespace VisemoServices.Services
{
    public class EmotionServices : IEmotionServices
    {
        private readonly InferenceSession _session;

        public EmotionServices()
        {
            // Get the expected path of the ONNX file
            string modelPath = Path.Combine(Directory.GetCurrentDirectory(), "Model", "emotion.onnx");
            _session = new InferenceSession(modelPath);
        }

        public async Task<string> DetectEmotionAsync(byte[] imageBytes)
        {
            return await Task.Run(() =>
            {
                using var image = SixLabors.ImageSharp.Image.Load<Rgb24>(imageBytes);

                // Resize to 224x224 to match the model's expected input size
                image.Mutate(x => x.Resize(224, 224));

                // Convert image to tensor
                var inputTensor = ConvertImageToTensor(image);

                // Create input for the model with the correct tensor format (batch_size, height, width, channels)
                var inputs = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor("resnet50_input", inputTensor)
        };

                // Run the inference session
                using var results = _session.Run(inputs);
                var outputTensor = results.First().AsTensor<float>().ToArray();

                return ProcessModelOutput(outputTensor);
            });
        }

        private DenseTensor<float> ConvertImageToTensor(Image<Rgb24> image)
        {
            // Resize image to 224x224
            image.Mutate(x => x.Resize(224, 224));

            // Allocate an array for the image data
            float[] imageData = new float[224 * 224 * 3]; // ResNet expects (224, 224, 3) format
            int index = 0;

            // Loop over the image pixels and populate the tensor
            for (int y = 0; y < 224; y++)
            {
                for (int x = 0; x < 224; x++)
                {
                    // Ensure we're not out of bounds
                    if (x < image.Width && y < image.Height)
                    {
                        Rgb24 pixel = image[x, y]; // Access pixel at (x, y)
                        imageData[index++] = pixel.R / 255.0f; // Normalize to 0-1 range
                        imageData[index++] = pixel.G / 255.0f;
                        imageData[index++] = pixel.B / 255.0f;
                    }
                }
            }

            // Return the tensor with dimensions [1, 224, 224, 3] (batch_size, height, width, channels)
            return new DenseTensor<float>(imageData, new[] { 1, 224, 224, 3 });
        }

        private string ProcessModelOutput(float[] output)
        {
            // Print full output for debugging
            Console.WriteLine($"Full model output: {string.Join(", ", output)}");

            // List of emotions corresponding to the model output
            string[] emotions = { "angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised" };

            // Apply softmax to all output values to get probabilities
            float maxVal = output.Max();
            float[] expValues = output.Select(v => MathF.Exp(v - maxVal)).ToArray();  // Subtract max for numerical stability
            float sumExp = expValues.Sum();
            float[] probabilities = expValues.Select(v => v / sumExp).ToArray();

            // Debugging: Print normalized probabilities
            Console.WriteLine($"Normalized probabilities: {string.Join(", ", probabilities)}");

            // Find the index of the highest probability
            int maxIndex = Array.IndexOf(probabilities, probabilities.Max());

            // Return the emotion with the highest probability
            return emotions[maxIndex];
        }

        public void Dispose()
        {
            _session.Dispose();
        }
    }
}
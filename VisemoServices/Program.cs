using Microsoft.EntityFrameworkCore;
using VisemoServices.Services;
using VisemoServices.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
// CORS enabler
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

ServerVersion serverVersion = ServerVersion.AutoDetect(connectionString);

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseMySql(connectionString, serverVersion);
});

//Enable Dependency Injection
builder.Services.AddScoped<IUserServices, UserServices>();
// Register IOnnxService as a Singleton
builder.Services.AddSingleton<IEmotionServices, EmotionServices>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

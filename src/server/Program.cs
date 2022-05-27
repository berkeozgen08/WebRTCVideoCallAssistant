using WebRTCVideoCallAssistant.Server.Helpers;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddAutoMapper(typeof(ModelProfile));
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<MeetingService>();
builder.Services.AddScoped<StatService>();

builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors(x => x
	.AllowAnyOrigin()
	.AllowAnyMethod()
	.AllowAnyHeader());

app.UseMiddleware<ErrorHandlerMiddleware>();

app.MapControllers();

app.Run();

// https://benfoster.io/blog/mvc-to-minimal-apis-aspnet-6/

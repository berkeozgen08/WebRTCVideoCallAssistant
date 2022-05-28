using System.Net;
using System.Text.Json;

namespace WebRTCVideoCallAssistant.Server.Helpers;

public class ErrorHandlerMiddleware
{
	private readonly RequestDelegate _next;
	private readonly ILogger _logger;

	public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
	{
		_next = next;
		_logger = logger;
	}

	public async Task Invoke(HttpContext context, IWebHostEnvironment env)
	{
		try
		{
			await _next(context);
		}
		catch (Exception error)
		{
			var response = context.Response;
			response.ContentType = "application/json";

			switch (error)
			{
				case ApplicationException:
					response.StatusCode = (int) HttpStatusCode.BadRequest;
					break;
				case KeyNotFoundException:
					response.StatusCode = (int) HttpStatusCode.NotFound;
					break;
				case UnauthorizedAccessException:
					response.StatusCode = (int) HttpStatusCode.Unauthorized;
					break;
				default:
					_logger.LogError(error, error.Message);
					response.StatusCode = (int) HttpStatusCode.InternalServerError;
					break;
			}
			
			string result;
			if (env.IsDevelopment())
			{
				result = JsonSerializer.Serialize(new
					{
						message = error?.Message,
						stack = error?.StackTrace,
						source = error?.Source
					}
				);
			}
			else
			{
				result = JsonSerializer.Serialize(new { message = error?.Message });
			}
			
			await response.WriteAsync(result);
		}
	}
}
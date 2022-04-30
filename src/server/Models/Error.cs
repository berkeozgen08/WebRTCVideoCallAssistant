namespace WebRTCVideoCallAssistant.Server.Models;

public record Error(
	string Message,
	IDictionary<string, string>? Errors = null,
	string? Stack = null
);
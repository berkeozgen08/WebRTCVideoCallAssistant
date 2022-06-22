using Microsoft.AspNetCore.Authorization;

namespace WebRTCVideoCallAssistant.Server.Helpers.Attributes;

public class UserAttribute : AuthorizeAttribute
{
	public UserAttribute()
	{
		Roles = $"{Role.User}, {Role.Admin}";
	}
}
using Microsoft.AspNetCore.Authorization;

namespace WebRTCVideoCallAssistant.Server.Helpers.Attributes;

public class AdminAttribute : AuthorizeAttribute
{
	public AdminAttribute()
	{
		Roles = Role.Admin;
	}
}
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace WebRTCVideoCallAssistant.Server.Services;

public class AuthService {
    private readonly UserService _userService;
	
	public AuthService(UserService userService)
	{
		_userService = userService;
	}

	public bool Validate(string email, string password)
	{
		var user = _userService.GetByEmail(email)
			?? throw new UnauthorizedAccessException("Incorrect email");
		return BCrypt.Net.BCrypt.Verify(password, user.Password);
	}
	
	public ClaimsPrincipal CreateClaim(string email, string role)
	{
		var claims = new List<Claim>
		{
			new Claim(ClaimTypes.Name, email),
			new Claim(ClaimTypes.Role, role)
		};

		var claimsIdentity = new ClaimsIdentity(
			claims, CookieAuthenticationDefaults.AuthenticationScheme);

		return new ClaimsPrincipal(claimsIdentity);
	}
}
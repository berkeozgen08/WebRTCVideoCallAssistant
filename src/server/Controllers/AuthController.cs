using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Helpers;
using WebRTCVideoCallAssistant.Server.Models.Dto;
using WebRTCVideoCallAssistant.Server.Services;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class AuthController : ControllerBase
{
	private readonly AuthService _authService;

	public AuthController(AuthService authService)
	{
		_authService = authService;
	}
	
	// TODO: add admin signin
	[HttpPost]
	public async Task<IActionResult> SignIn(SignInUserDto cred)
	{
		if (!_authService.Validate(cred.Email, cred.Password))
			throw new UnauthorizedAccessException("Incorrect password");
		await HttpContext.SignInAsync(
			CookieAuthenticationDefaults.AuthenticationScheme,
			_authService.CreateClaim(cred.Email, Role.User)
		);
		return Ok();
	}
}
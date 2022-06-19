using System.Security.Claims;
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
	
	[HttpPost]
	public IActionResult SignIn(SignInUserDto cred)
	{
		var user = _authService.ValidateUser(cred.Email, cred.Password);
		return Ok(new {
			token = _authService.GenerateToken(
				new Claim("id", user.Id.ToString()),
				new Claim("email", user.Email),
				new Claim("firstName", user.FirstName),
				new Claim("lastName", user.LastName),
				new Claim("phone", user.Phone),
				new Claim("role", Role.User)
			)
		});
	}
	
	[HttpPost]
	public IActionResult SignInAdmin(SignInAdminDto cred)
	{
		var admin = _authService.ValidateAdmin(cred.Username, cred.Password);
		return Ok(new {
			token = _authService.GenerateToken(
				new Claim("id", admin.Id.ToString()),
				new Claim("username", admin.Username),
				new Claim("role", Role.Admin)
			)
		});
	}
}
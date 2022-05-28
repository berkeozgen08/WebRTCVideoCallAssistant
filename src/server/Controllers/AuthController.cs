using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
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
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
				new Claim(ClaimTypes.MobilePhone, user.Phone),
				new Claim(ClaimTypes.Role, Role.User)
			)
		});
	}
	
	[HttpPost]
	public IActionResult SignInAdmin(SignInAdminDto cred)
	{
		var admin = _authService.ValidateAdmin(cred.Username, cred.Password);
		return Ok(new {
			token = _authService.GenerateToken(
				new Claim(ClaimTypes.Name, admin.Username),
				new Claim(ClaimTypes.Role, Role.Admin)
			)
		});
	}
}
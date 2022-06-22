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
				new Claim(Constants.Claims.ID, user.Id.ToString()),
				new Claim(Constants.Claims.EMAIL, user.Email),
				new Claim(Constants.Claims.FIRSTNAME, user.FirstName),
				new Claim(Constants.Claims.LASTNAME, user.LastName),
				new Claim(Constants.Claims.PHONE, user.Phone),
				new Claim(Constants.Claims.ROLE, Role.User)
			)
		});
	}
	
	[HttpPost]
	public IActionResult SignInAdmin(SignInAdminDto cred)
	{
		var admin = _authService.ValidateAdmin(cred.Username, cred.Password);
		return Ok(new {
			token = _authService.GenerateToken(
				new Claim(Constants.Claims.ID, admin.Id.ToString()),
				new Claim(Constants.Claims.USERNAME, admin.Username),
				new Claim(Constants.Claims.ROLE, Role.Admin)
			)
		});
	}
}
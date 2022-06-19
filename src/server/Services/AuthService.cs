using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebRTCVideoCallAssistant.Server.Helpers;
using WebRTCVideoCallAssistant.Server.Models;

namespace WebRTCVideoCallAssistant.Server.Services;

public class AuthService
{
	private readonly UserService _userService;
	private readonly AdminService _adminService;
	private readonly IConfiguration _configuration;

	public AuthService(UserService userService, AdminService adminService, IConfiguration configuration)
	{
		_userService = userService;
		_adminService = adminService;
		_configuration = configuration;
	}

	public User ValidateUser(string email, string password)
	{
		var user = _userService.GetByEmail(email)
			?? throw new UnauthorizedAccessException("Incorrect email");

		var salt=BCrypt.Net.BCrypt.GenerateSalt(Constants.SALT);
		var hashedPassword=BCrypt.Net.BCrypt.HashPassword(password,salt);

		return BCrypt.Net.BCrypt.Verify(hashedPassword, user.Password)
			? user
			: throw new UnauthorizedAccessException("Incorrect password");
	}

	public Admin ValidateAdmin(string username, string password)
	{
		var admin = _adminService.GetByUsername(username)
			?? throw new UnauthorizedAccessException("Incorrect username");

		var salt=BCrypt.Net.BCrypt.GenerateSalt(Constants.SALT);
		var hashedPassword=BCrypt.Net.BCrypt.HashPassword(password,salt);

		return BCrypt.Net.BCrypt.Verify(hashedPassword, admin.Password)
			? admin
			: throw new UnauthorizedAccessException("Incorrect password");
	}

	public string GenerateToken(params Claim[] claims)
	{
		var key = _configuration["Jwt:Key"];
		var issuer = _configuration["Jwt:Issuer"];

		var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
		var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

		var token = new JwtSecurityToken(
			issuer: issuer,
			audience: issuer,
			claims: claims,
			expires: DateTime.Now.AddMinutes(120),
			signingCredentials: credentials
		);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}
}
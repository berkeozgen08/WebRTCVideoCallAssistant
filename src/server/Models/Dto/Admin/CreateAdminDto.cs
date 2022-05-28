using System.ComponentModel.DataAnnotations;
using WebRTCVideoCallAssistant.Server.Helpers;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class CreateAdminDto
{
	[Required]
	public string Username { get; set; } = null!;
	
	[Required]
	[MinLength(Constants.MIN_PASSWORD_LENGTH)]
	public string Password { get; set; } = null!;
}
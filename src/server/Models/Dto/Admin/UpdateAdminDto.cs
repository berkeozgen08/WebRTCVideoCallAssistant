using System.ComponentModel.DataAnnotations;
using WebRTCVideoCallAssistant.Server.Helpers;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class UpdateAdminDto
{
	public string? Username { get; set; }

	[MinLength(Constants.MIN_PASSWORD_LENGTH)]
	public string? Password { get; set; }
}
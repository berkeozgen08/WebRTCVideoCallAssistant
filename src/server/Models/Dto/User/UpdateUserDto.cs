using System.ComponentModel.DataAnnotations;
using WebRTCVideoCallAssistant.Server.Helpers;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class UpdateUserDto {	
	[MinLength(Constants.MIN_PASSWORD_LENGTH)]
	public string? Password { get; set; }
	
	[Phone]
	public string? Phone { get; set; }
}
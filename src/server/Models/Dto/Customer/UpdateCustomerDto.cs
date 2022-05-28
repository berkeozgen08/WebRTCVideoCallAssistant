using System.ComponentModel.DataAnnotations;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class UpdateCustomerDto
{
	[EmailAddress]
	public string? Email { get; set; }

	[Phone]
	public string? Phone { get; set; }
}
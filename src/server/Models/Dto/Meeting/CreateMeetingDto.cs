using System.ComponentModel.DataAnnotations;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class CreateMeetingDto
{
	[Required]
	public int CreatedBy { get; set; }

	[Required]
	public int CreatedFor { get; set; }

	[Required]
	public DateTime StartsAt { get; set; }
}
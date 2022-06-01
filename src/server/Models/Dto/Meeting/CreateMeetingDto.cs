using System.ComponentModel.DataAnnotations;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class CreateMeetingDto
{
	[Required]
	public int CreatedById { get; set; }

	[Required]
	public int CreatedForId { get; set; }

	[Required]
	public DateTime StartsAt { get; set; }
}
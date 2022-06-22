using System.ComponentModel.DataAnnotations;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class UpdateMeetingDto
{
	public int? CreatedById { get; set; }
	public int? CreatedForId { get; set; }
	public DateTime? StartsAt { get; set; }
}
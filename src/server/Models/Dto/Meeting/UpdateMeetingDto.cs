using System.ComponentModel.DataAnnotations;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class UpdateMeetingDto {
	public DateTime StartsAt { get; set; }
}
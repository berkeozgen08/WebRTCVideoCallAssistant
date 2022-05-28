using System.ComponentModel.DataAnnotations;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class UpdateStatDto
{
	public int? UserVideoTime { get; set; }
	public int? UserSpeakTime { get; set; }
	public int? CustomerVideoTime { get; set; }
	public int? CustomerSpeakTime { get; set; }
	public DateTime? EndedAt { get; set; }
}
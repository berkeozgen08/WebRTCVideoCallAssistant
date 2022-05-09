using System;
using System.Collections.Generic;

namespace WebRTCVideoCallAssistant.Server.Models;

public class MeetingDto
{
	public User CreatedBy { get; set; }
	public Customer CreatedFor { get; set; }
	public string ConnId { get; set; } = null!;
	public DateTime StartsAt { get; set; }

	public MeetingDto(Meeting meeting) {
		CreatedBy = meeting.CreatedByNavigation;
		CreatedFor = meeting.CreatedForNavigation;
		StartsAt = meeting.StartsAt;
	}
}

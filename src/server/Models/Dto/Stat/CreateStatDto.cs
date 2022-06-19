using System.ComponentModel.DataAnnotations;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class VideoStat
{
	[Required]
	public DateTime Date { get; set; }

	[Required]
	public bool Visible { get; set; }
}

public class AudioStat
{
	[Required]
	public DateTime Date { get; set; }

	[Required]
	public bool Speaking { get; set; }
}

public class StreamStat
{
	[Required]
	public VideoStat[] Video { get; set; } = null!;
	
	[Required]
	public AudioStat[] Audio { get; set; } = null!;
}

public class CreateStatDto
{
	[Required]
	public int MeetingId { get; set; }

	[Required]
	public StreamStat Local { get; set; } = null!;

	[Required]
	public StreamStat Remote { get; set; } = null!;

	[Required]
	public int Interval { get; set; }
}
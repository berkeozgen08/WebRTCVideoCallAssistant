using AutoMapper;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Services;

public class StatService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly MeetingService _meetingService;
	
	public StatService(AppDbContext db, IMapper mapper, MeetingService meetingService)
	{
		_db = db;
		_mapper = mapper;
		_meetingService = meetingService;
	}

	public Stat Create(CreateStatDto dto)
	{
		var meeting = _meetingService.Get(dto.MeetingId)
			?? throw new KeyNotFoundException($"Meeting with ID {dto.MeetingId} does not exist");
		
		var interval = dto.Interval;
		var local = dto.Local;
		var remote = dto.Remote;

		var (localVideoTime, localAudioTime) = CalculateTime(local, interval);
		var (remoteVideoTime, remoteAudioTime) = CalculateTime(remote, interval);

        var stat = new Stat
		{
			UserVideoTime = localVideoTime,
			UserSpeakTime = localAudioTime,
			CustomerVideoTime = remoteVideoTime,
			CustomerSpeakTime = remoteAudioTime,
			EndedAt = DateTime.Now
		};
        var res = _db.Stats.Add(stat).Entity;
        _db.SaveChanges();
		meeting.StatId = res.Id;
        _db.SaveChanges();

		return res;
	}

	public Stat Get(int id)
	{
		return GetById(id);
	}

	public IEnumerable<Stat> GetAll()
	{
		return _db.Stats;
	}

	public Stat Update(int id, UpdateStatDto dto)
    {
        var stat = GetById(id);

        _mapper.Map(dto, stat);
        var res = _db.Stats.Update(stat).Entity;
        _db.SaveChanges();

		return res;
    }

	public Stat Delete(int id)
    {
        var stat = GetById(id);

        var res = _db.Stats.Remove(stat).Entity;
        _db.SaveChanges();

		return res;
    }

	private Stat GetById(int id)
	{
		var stat = _db.Stats.Find(id);
        if (stat == null) throw new KeyNotFoundException("Stat not found");
        return stat;
	}

	private static (int videoTime, int audioTime) CalculateTime(StreamStat streamStat, int interval)
	{
		var video = streamStat.Video;
		var videoTime = 0;
		for (var i = 0; i < video.Length; i++)
		{
			if (video[i].Visible)
				videoTime += interval;
			else if (i > 0 && video[i - 1].Visible)
				videoTime += interval / 2;
		}

		var audio = streamStat.Audio;
		var audioTime = 0;
		DateTime? lastSpoken = null;
		for (var i = 0; i < audio.Length; i++)
		{
			if (audio[i].Speaking && lastSpoken == null)
				lastSpoken = audio[i].Date;
			else if (!audio[i].Speaking && lastSpoken != null)
			{
				audioTime += (int) (audio[i].Date - lastSpoken).Value.TotalMilliseconds;
				lastSpoken = null;
			}
		}
		
		return (videoTime, audioTime);
	}
}
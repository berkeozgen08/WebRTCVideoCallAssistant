using AutoMapper;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Services;

public class MeetingService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
	
	public MeetingService(AppDbContext db, IMapper mapper)
	{
		_db = db;
		_mapper = mapper;
	}

	public Meeting Create(CreateMeetingDto dto)
	{
        var meeting = _mapper.Map<Meeting>(dto);

		string userConnId = Guid.NewGuid().ToString();
		string customerConnId = Guid.NewGuid().ToString();
		
		var buffer = new char[8];
		var random = new Random();
		var alph = "abcdefghijklmnopqrstuvwxyz";

		for (int i = 0; i < 8; i++)
			buffer[i] = alph[random.Next(alph.Length)];
		string userSlug = string.Join("", buffer);

		for (int i = 0; i < 8; i++)
			buffer[i] = alph[random.Next(alph.Length)];
		string customerSlug = string.Join("", buffer);
		
        var res = _db.Meetings.Add(meeting).Entity;
        _db.SaveChanges();

		return res;
	}

	public Meeting Get(int id)
	{
		return GetById(id);
	}

	public IEnumerable<Meeting> GetAll()
	{
		return _db.Meetings;
	}

	public Meeting Update(int id, UpdateMeetingDto dto)
    {
        var meeting = GetById(id);

        _mapper.Map(dto, meeting);
        var res = _db.Meetings.Update(meeting).Entity;
        _db.SaveChanges();

		return res;
    }

	public Meeting Delete(int id)
    {
        var meeting = GetById(id);

        var res = _db.Meetings.Remove(meeting).Entity;
        _db.SaveChanges();

		return res;
    }

	public Meeting ResolveUserSlug(string userSlug)
	{
		var meeting = _db.Meetings.FirstOrDefault(i => i.UserSlug == userSlug);
		if (meeting == null)
			throw new KeyNotFoundException($"Meeting with user slug '{userSlug}' not found");
		return meeting;
	}

	public Meeting ResolveCustomerSlug(string customerSlug)
	{
		var meeting = _db.Meetings.FirstOrDefault(i => i.CustomerSlug == customerSlug);
		if (meeting == null)
			throw new KeyNotFoundException($"Meeting with customer slug '{customerSlug}' not found");
		return meeting;
	}

	private Meeting GetById(int id)
	{
		var meeting = _db.Meetings.Find(id);
        if (meeting == null) throw new KeyNotFoundException("Meeting not found");
        return meeting;
	}
}
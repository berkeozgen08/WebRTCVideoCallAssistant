using AutoMapper;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Services;

public class StatService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
	
	public StatService(AppDbContext db, IMapper mapper)
	{
		_db = db;
		_mapper = mapper;
	}

	public Stat Create(Meeting meeting)
	{
        var stat = new Stat();

        var res = _db.Stats.Add(stat).Entity;
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
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebRTCVideoCallAssistant.Server.Models;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class MeetingController : ControllerBase
{
	private readonly ILogger<MeetingController> _logger;
	private readonly AppDbContext _db;

	public MeetingController(ILogger<MeetingController> logger, AppDbContext db)
	{
		_logger = logger;
		_db = db;
	}

	[HttpPost("[action]")]
	public ActionResult<Meeting> Create(Meeting meeting)
	{
		var res = _db.Meetings.Add(meeting).Entity;
		try
		{
			_db.SaveChanges();
		}
		catch (DbUpdateException e)
		{
			return BadRequest(new Error(e.Message));
		}
		return Ok(res);
	}

	[HttpGet("[action]")]
	public ActionResult<MeetingDto> ForUser(string userSlug)
	{
		var res = _db.Meetings.FirstOrDefault(meeting => meeting.UserSlug == userSlug);
		if (res is null) return NotFound(new Error("Meeting not found."));
		return Ok(new MeetingDto(res) { ConnId = res.CustomerConnId });
	}

	[HttpGet("[action]")]
	public ActionResult<MeetingDto> ForCustomer(string customerSlug)
	{
		var res = _db.Meetings.FirstOrDefault(meeting => meeting.CustomerSlug == customerSlug);
		if (res is null) return NotFound(new Error("Meeting not found."));
		return Ok(new MeetingDto(res) { ConnId = res.UserConnId });
	}
}
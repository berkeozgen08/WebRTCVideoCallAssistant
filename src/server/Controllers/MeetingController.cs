using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;
using WebRTCVideoCallAssistant.Server.Services;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class MeetingController : ControllerBase
{
	private readonly MeetingService _meetingService;

	public MeetingController(MeetingService meetingService)
	{
		_meetingService = meetingService;
	}

	[HttpPut]
	public ActionResult<Meeting> Create(CreateMeetingDto meeting)
	{
		return CreatedAtAction(nameof(Create), _meetingService.Create(meeting));
	}

	[HttpGet("{id}")]
	public ActionResult<Meeting> Get(int id)
	{
		return Ok(_meetingService.Get(id));
	}

	[HttpGet]
	public ActionResult<IEnumerable<Meeting>> GetAll()
	{
		return Ok(_meetingService.GetAll());
	}

	[HttpPatch("{id}")]
	public ActionResult<Meeting> Update(int id, UpdateMeetingDto dto)
	{
		return Ok(_meetingService.Update(id, dto));
	}

	[HttpDelete("{id}")]
	public ActionResult<Meeting> Delete(int id)
	{
		return Ok(_meetingService.Delete(id));
	}
	
	[HttpGet("{userSlug}")]
	public IActionResult ResolveUserSlug(string userSlug)
	{
		return Ok(new { connId = _meetingService.ResolveUserSlug(userSlug).CustomerConnId });
	}

	[HttpGet("{customerSlug}")]
	public IActionResult ResolveCustomerSlug(string customerSlug)
	{
		return Ok(new { connId = _meetingService.ResolveUserSlug(customerSlug).UserConnId });
	}
}
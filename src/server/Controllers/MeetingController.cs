using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Helpers;
using WebRTCVideoCallAssistant.Server.Helpers.Attributes;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;
using WebRTCVideoCallAssistant.Server.Services;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class MeetingController : ControllerBase
{
	private readonly MeetingService _meetingService;
	private readonly AuthService _authService;

	public MeetingController(MeetingService meetingService, AuthService authService)
	{
		_meetingService = meetingService;
		_authService = authService;
	}

	[User]
	[HttpPut]
	public ActionResult<Meeting> Create(CreateMeetingDto meeting)
	{
		var user = _authService.GetUser(User);
		if (user is Models.User && meeting.CreatedById != user.Id)
			throw new ApplicationException("Can not create meetings for other users");
		return CreatedAtAction(nameof(Create), _meetingService.Create(meeting));
	}

	[User]
	[HttpGet("{id}")]
	public ActionResult<Meeting> Get(int id)
	{
		var meeting = _meetingService.Get(id);
		var user = _authService.GetUser(User);
		if (user is Models.User && meeting.CreatedById != user.Id)
			throw new ApplicationException("Can not see other users' meetings");
		return Ok(meeting);
	}

	[Admin]
	[HttpGet]
	public ActionResult<IEnumerable<Meeting>> GetAll()
	{
		return Ok(_meetingService.GetAll());
	}

	[User]
	[HttpGet]
	public ActionResult<IQueryable<Meeting>> GetAllByUser()
	{
		return Ok(_meetingService.GetAllByUser(_authService.GetUser(User).Id));
	}

	[User]
	[HttpPatch("{id}")]
	public ActionResult<Meeting> Update(int id, UpdateMeetingDto dto)
	{
		return Ok(_meetingService.Update(id, dto));
	}

	[User]
	[HttpDelete("{id}")]
	public ActionResult<Meeting> Delete(int id)
	{
		return Ok(_meetingService.Delete(id));
	}
	
	[Public]
	[HttpGet("{slug}")]
	public ActionResult<Meeting> ResolveSlug(string slug)
	{
		return Ok(_meetingService.ResolveSlug(slug));
	}
}
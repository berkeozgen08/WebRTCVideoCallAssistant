using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;
using WebRTCVideoCallAssistant.Server.Services;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class StatController : ControllerBase
{
	private readonly StatService _statService;

	public StatController(StatService statService)
	{
		_statService = statService;
	}

	[HttpPut]
	public ActionResult<Stat> Create(CreateStatDto stat)
	{
		return CreatedAtAction(nameof(Create), _statService.Create(stat));
	}

	[HttpGet("{id}")]
	public ActionResult<Stat> Get(int id)
	{
		return Ok(_statService.Get(id));
	}

	[HttpGet]
	public ActionResult<IEnumerable<Stat>> GetAll()
	{
		return Ok(_statService.GetAll());
	}
	
	[HttpPatch("{id}")]
	public ActionResult<Stat> Update(int id, UpdateStatDto dto)
	{
		return Ok(_statService.Update(id, dto));
	}

	[HttpDelete("{id}")]
	public ActionResult<Stat> Delete(int id)
	{
		return Ok(_statService.Delete(id));
	}
}
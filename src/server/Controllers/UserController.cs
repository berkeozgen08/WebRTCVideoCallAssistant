using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Helpers.Attributes;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;
using WebRTCVideoCallAssistant.Server.Services;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[Admin]
[ApiController]
[Route("[controller]/[action]")]
public class UserController : ControllerBase
{
	private readonly UserService _userService;

	public UserController(UserService userService)
	{
		_userService = userService;
	}

	[HttpPut]
	public ActionResult<User> Create(CreateUserDto user)
	{
		return CreatedAtAction(nameof(Create), _userService.Create(user));
	}

	[HttpGet("{id}")]
	public ActionResult<User> Get(int id)
	{
		return Ok(_userService.Get(id));
	}

	[HttpGet]
	public ActionResult<IEnumerable<User>> GetAll()
	{
		return Ok(_userService.GetAll());
	}

	[HttpPatch("{id}")]
	public ActionResult<User> Update(int id, UpdateUserDto dto)
	{
		return Ok(_userService.Update(id, dto));
	}

	[HttpDelete("{id}")]
	public ActionResult<User> Delete(int id)
	{
		return Ok(_userService.Delete(id));
	}
}
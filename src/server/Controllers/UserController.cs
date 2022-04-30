using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebRTCVideoCallAssistant.Server.Models;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
	private readonly ILogger<UserController> _logger;
	private readonly AppDbContext _db;

	public UserController(ILogger<UserController> logger, AppDbContext db)
	{
		_logger = logger;
		_db = db;
	}

	[HttpPost("[action]")]
	public ActionResult<User> Create(User user)
	{
		var res = _db.Users.Add(user).Entity;
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
}
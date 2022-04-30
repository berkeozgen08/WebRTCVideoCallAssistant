using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebRTCVideoCallAssistant.Server.Models;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController : ControllerBase
{
	private readonly ILogger<CustomerController> _logger;
	private readonly AppDbContext _db;

	public CustomerController(ILogger<CustomerController> logger, AppDbContext db)
	{
		_logger = logger;
		_db = db;
	}

	[HttpPost("[action]")]
	public ActionResult<Customer> Create(Customer customer)
	{
		var res = _db.Customers.Add(customer).Entity;
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
using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;
using WebRTCVideoCallAssistant.Server.Services;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class CustomerController : ControllerBase
{
	private readonly CustomerService _customerService;

	public CustomerController(CustomerService customerService)
	{
		_customerService = customerService;
	}

	[HttpPut]
	public ActionResult<Customer> Create(CreateCustomerDto customer)
	{
		return CreatedAtAction(nameof(Create), _customerService.Create(customer));
	}

	[HttpGet("{id}")]
	public ActionResult<Customer> Get(int id)
	{
		return Ok(_customerService.Get(id));
	}

	[HttpGet]
	public ActionResult<IEnumerable<Customer>> GetAll()
	{
		return Ok(_customerService.GetAll());
	}

	[HttpPatch("{id}")]
	public ActionResult<Customer> Update(int id, UpdateCustomerDto dto)
	{
		return Ok(_customerService.Update(id, dto));
	}

	[HttpDelete("{id}")]
	public ActionResult<Customer> Delete(int id)
	{
		return Ok(_customerService.Delete(id));
	}
}
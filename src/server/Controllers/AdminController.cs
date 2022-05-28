using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;
using WebRTCVideoCallAssistant.Server.Services;

namespace WebRTCVideoCallAssistant.Server.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class AdminController : ControllerBase
{
	private readonly AdminService _adminService;

	public AdminController(AdminService adminService)
	{
		_adminService = adminService;
	}

	[HttpPut]
	public ActionResult<Admin> Create(CreateAdminDto admin)
	{
		return CreatedAtAction(nameof(Create), _adminService.Create(admin));
	}

	[HttpGet("{id}")]
	public ActionResult<Admin> Get(int id)
	{
		return Ok(_adminService.Get(id));
	}

	[HttpGet]
	public ActionResult<IEnumerable<Admin>> GetAll()
	{
		return Ok(_adminService.GetAll());
	}

	[HttpPatch("{id}")]
	public ActionResult<Admin> Update(int id, UpdateAdminDto dto)
	{
		return Ok(_adminService.Update(id, dto));
	}

	[HttpDelete("{id}")]
	public ActionResult<Admin> Delete(int id)
	{
		return Ok(_adminService.Delete(id));
	}
}
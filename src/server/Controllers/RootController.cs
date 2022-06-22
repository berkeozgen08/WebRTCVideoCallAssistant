using Microsoft.AspNetCore.Mvc;
using WebRTCVideoCallAssistant.Server.Helpers.Attributes;

namespace WebRTCVideoCallAssistant.Server.Controllers;

public class RootController
{
	[Public]
    [HttpGet("/")]
    public string Hello() => "Hello World";
}
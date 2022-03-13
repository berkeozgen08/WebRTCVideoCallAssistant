using Microsoft.AspNetCore.Mvc;

namespace WebRTCVideoCallAssistant.Server.Controllers;

public class RootController
{
    [HttpGet("/")]
    public string Hello() => "Hello World";
}
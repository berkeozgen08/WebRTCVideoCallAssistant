using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebRTCVideoCallAssistant.Server.Models
{
    public partial class Admin
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
		[JsonIgnore]
        public string Password { get; set; } = null!;
    }
}

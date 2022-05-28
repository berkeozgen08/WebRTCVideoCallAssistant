using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebRTCVideoCallAssistant.Server.Models
{
    public partial class User
    {
        public User()
        {
            Meetings = new HashSet<Meeting>();
        }

        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
		[JsonIgnore]
        public string Password { get; set; } = null!;
        public string Phone { get; set; } = null!;

        public virtual ICollection<Meeting> Meetings { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebRTCVideoCallAssistant.Server.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Meetings = new HashSet<Meeting>();
        }

        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;

		[JsonIgnore]
        public virtual ICollection<Meeting> Meetings { get; set; }
    }
}

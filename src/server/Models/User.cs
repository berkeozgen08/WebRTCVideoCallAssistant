using System;
using System.Collections.Generic;

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

        public virtual ICollection<Meeting> Meetings { get; set; }
    }
}

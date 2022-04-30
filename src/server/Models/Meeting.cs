using System;
using System.Collections.Generic;

namespace WebRTCVideoCallAssistant.Server.Models
{
    public partial class Meeting
    {
        public int Id { get; set; }
        public int CreatedBy { get; set; }
        public int CreatedFor { get; set; }
        public string UserConnId { get; set; } = null!;
        public string CustomerConnId { get; set; } = null!;
        public string UserSlug { get; set; } = null!;
        public string CustomerSlug { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime StartsAt { get; set; }

        public virtual User CreatedByNavigation { get; set; } = null!;
        public virtual Customer CreatedForNavigation { get; set; } = null!;
    }
}

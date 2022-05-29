using System;
using System.Collections.Generic;

namespace WebRTCVideoCallAssistant.Server.Models
{
    public partial class Meeting
    {
        public int Id { get; set; }
        public int CreatedById { get; set; }
        public int CreatedForId { get; set; }
        public string UserConnId { get; set; } = null!;
        public string CustomerConnId { get; set; } = null!;
        public string UserSlug { get; set; } = null!;
        public string CustomerSlug { get; set; } = null!;
        public DateTime StartsAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? StatId { get; set; }

        public virtual User CreatedBy { get; set; } = null!;
        public virtual Customer CreatedFor { get; set; } = null!;
        public virtual Stat? Stat { get; set; }
    }
}

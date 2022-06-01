using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebRTCVideoCallAssistant.Server.Models
{
    public partial class Stat
    {
        public Stat()
        {
            Meetings = new HashSet<Meeting>();
        }

        public int Id { get; set; }
        public int? UserVideoTime { get; set; }
        public int? UserSpeakTime { get; set; }
        public int? CustomerVideoTime { get; set; }
        public int? CustomerSpeakTime { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }

		[JsonIgnore]
        public virtual ICollection<Meeting> Meetings { get; set; }
    }
}

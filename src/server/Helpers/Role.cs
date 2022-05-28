namespace WebRTCVideoCallAssistant.Server.Helpers;

public class Role
{
	public static Role User { get => new("user"); }
	public static Role Admin { get => new("admin"); }

	private readonly string _value;
	private Role(string value) => _value = value;

	public override string ToString() => _value;
	public static implicit operator string(Role r) => r.ToString();
}

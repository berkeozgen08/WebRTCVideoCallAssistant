namespace WebRTCVideoCallAssistant.Server.Helpers;

public static class Constants
{
	public const int MAX_STRING_LENGTH = 64;
	public const int MIN_PASSWORD_LENGTH = 8;

	public static class Claims
	{
		public const string ID = "id";
		public const string EMAIL = "email";
		public const string FIRSTNAME = "firstName";
		public const string LASTNAME = "lastName";
		public const string PHONE = "phone";
		public const string ROLE = "role";

		public const string USERNAME = "username";
	}
}

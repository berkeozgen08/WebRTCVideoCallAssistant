using System.ComponentModel.DataAnnotations;
using System.Globalization;
using WebRTCVideoCallAssistant.Server.Helpers;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class UpdateUserDto
{
	private string? _firstName;
	private string? _lastName;

	[MaxLength(Constants.MAX_STRING_LENGTH)]
	public string? FirstName
	{
		get => _firstName;
		set => _firstName = value is null ? null : CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.Trim());
	}
	
	[MaxLength(Constants.MAX_STRING_LENGTH)]
	public string? LastName
	{
		get => _lastName;
		set => _lastName = value is null ? null : CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.Trim());
	}
	
	[EmailAddress]
	public string? Email { get; set; }
	
	[MinLength(Constants.MIN_PASSWORD_LENGTH)]
	public string? Password { get; set; }

	[Phone]
	public string? Phone { get; set; }
}
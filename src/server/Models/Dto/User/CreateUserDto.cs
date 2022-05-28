using System.ComponentModel.DataAnnotations;
using System.Globalization;
using WebRTCVideoCallAssistant.Server.Helpers;

namespace WebRTCVideoCallAssistant.Server.Models.Dto;

public class CreateUserDto
{
	private string _firstName = null!;
	private string _lastName = null!;

	[Required]
	[MaxLength(Constants.MAX_STRING_LENGTH)]
	public string FirstName
	{
		get => _firstName;
		set => _firstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.Trim());
	}
	
	[Required]
	[MaxLength(Constants.MAX_STRING_LENGTH)]
	public string LastName
	{
		get => _lastName;
		set => _lastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.Trim());
	}
	
	[Required]
	[EmailAddress]
	public string Email { get; set; } = null!;
	
	[Required]
	[MinLength(Constants.MIN_PASSWORD_LENGTH)]
	public string Password { get; set; } = null!;
	
	[Required]
	[Phone]
	public string Phone { get; set; } = null!;
}
using AutoMapper;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Helpers;

public class ModelProfile : Profile
{
	public ModelProfile()
	{
		CreateMap<CreateUserDto, User>();
		CreateMap<UpdateUserDto, User>();

		CreateMap<CreateCustomerDto, Customer>();
		CreateMap<UpdateCustomerDto, Customer>();

		CreateMap<CreateMeetingDto, Meeting>();
		CreateMap<UpdateMeetingDto, Meeting>();
	}
}
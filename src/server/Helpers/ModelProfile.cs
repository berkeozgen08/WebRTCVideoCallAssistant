using AutoMapper;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Helpers;

public class ModelProfile : Profile
{
	public ModelProfile()
	{
		CreateMap<CreateUserDto, User>();
		CreateMap<UpdateUserDto, User>()
			.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

		CreateMap<CreateCustomerDto, Customer>();
		CreateMap<UpdateCustomerDto, Customer>()
			.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

		CreateMap<CreateMeetingDto, Meeting>();
		CreateMap<UpdateMeetingDto, Meeting>()
			.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

		CreateMap<UpdateStatDto, Stat>()
			.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
		
		CreateMap<CreateAdminDto, Admin>();
		CreateMap<UpdateAdminDto, Admin>()
			.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
	}
}
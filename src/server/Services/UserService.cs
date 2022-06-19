using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebRTCVideoCallAssistant.Server.Helpers;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Services;

public class UserService {
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
	
	public UserService(AppDbContext db, IMapper mapper)
	{
		_db = db;
		_mapper = mapper;
	}

	public User Create(CreateUserDto dto)
	{
        if (_db.Users.Any(i => i.Email == dto.Email))
            throw new ApplicationException($"User with email '{dto.Email}' already exists");
        if (_db.Users.Any(i => i.Phone == dto.Phone))
            throw new ApplicationException($"User with phone '{dto.Phone}' already exists");

        var user = _mapper.Map<User>(dto);
		var salt=BCrypt.Net.BCrypt.GenerateSalt(Constants.SALT);
        user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password,salt);

        var res = _db.Users.Add(user).Entity;
        _db.SaveChanges();

		return res;
	}

	public User Get(int id)
	{
		return GetById(id);
	}

	public IEnumerable<User> GetAll()
	{
		return _db.Users
			.Include(u => u.Meetings)
			.ThenInclude(m => m.CreatedFor)
			.Include(u => u.Meetings)
			.ThenInclude(m => m.Stat);
	}

	public User Update(int id, UpdateUserDto dto)
    {
        var user = GetById(id);

        if (dto.Phone != user.Phone && _db.Users.Any(i => i.Phone == dto.Phone))
            throw new ApplicationException($"User with phone '{dto.Phone}' already exists");

        if (!string.IsNullOrEmpty(dto.Password)){
			var salt=BCrypt.Net.BCrypt.GenerateSalt(Constants.SALT);
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password,salt);
		}
			
        _mapper.Map(dto, user);
        var res = _db.Users.Update(user).Entity;
        _db.SaveChanges();

		return res;
    }

	public User Delete(int id)
    {
        var user = GetById(id);

        var res = _db.Users.Remove(user).Entity;
        _db.SaveChanges();

		return res;
    }

	public User? GetByEmail(string email)
	{
		return _db.Users.FirstOrDefault(i => i.Email == email);
	}

	private User GetById(int id)
	{
		var user = _db.Users
			.Include(u => u.Meetings)
			.ThenInclude(m => m.CreatedFor)
			.Include(u => u.Meetings)
			.ThenInclude(m => m.Stat)
			.FirstOrDefault(u => u.Id == id);
        if (user == null) throw new KeyNotFoundException("User not found");
        return user;
	}
}
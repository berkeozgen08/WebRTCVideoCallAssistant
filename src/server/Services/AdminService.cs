using AutoMapper;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Services;

public class AdminService {
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
	
	public AdminService(AppDbContext db, IMapper mapper)
	{
		_db = db;
		_mapper = mapper;
	}

	public Admin Create(CreateAdminDto dto)
	{
        if (_db.Admins.Any(i => i.Username == dto.Username))
            throw new ApplicationException($"Admin with username '{dto.Username}' already exists");

        var admin = _mapper.Map<Admin>(dto);
        admin.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var res = _db.Admins.Add(admin).Entity;
        _db.SaveChanges();

		return res;
	}

	public Admin Get(int id)
	{
		return GetById(id);
	}

	public IEnumerable<Admin> GetAll()
	{
		return _db.Admins;
	}

	public Admin Update(int id, UpdateAdminDto dto)
    {
        var admin = GetById(id);

        if (!string.IsNullOrEmpty(dto.Password))
            admin.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        _mapper.Map(dto, admin);
        var res = _db.Admins.Update(admin).Entity;
        _db.SaveChanges();

		return res;
    }

	public Admin Delete(int id)
    {
        var admin = GetById(id);

        var res = _db.Admins.Remove(admin).Entity;
        _db.SaveChanges();

		return res;
    }

	public Admin? GetByUsername(string username)
	{
		return _db.Admins.FirstOrDefault(i => i.Username == username);
	}

	private Admin GetById(int id)
	{
		var admin = _db.Admins.Find(id);
        if (admin == null) throw new KeyNotFoundException("Admin not found");
        return admin;
	}
}
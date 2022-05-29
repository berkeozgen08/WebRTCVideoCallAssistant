using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebRTCVideoCallAssistant.Server.Models;
using WebRTCVideoCallAssistant.Server.Models.Dto;

namespace WebRTCVideoCallAssistant.Server.Services;

public class CustomerService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
	
	public CustomerService(AppDbContext db, IMapper mapper)
	{
		_db = db;
		_mapper = mapper;
	}

	public Customer Create(CreateCustomerDto dto)
	{
        if (_db.Customers.Any(i => i.Email == dto.Email))
            throw new ApplicationException($"Customer with email '{dto.Email}' already exists");
        if (_db.Customers.Any(i => i.Phone == dto.Phone))
            throw new ApplicationException($"Customer with phone '{dto.Phone}' already exists");

        var customer = _mapper.Map<Customer>(dto);

        var res = _db.Customers.Add(customer).Entity;
        _db.SaveChanges();

		return res;
	}

	public Customer Get(int id)
	{
		return GetById(id);
	}

	public IEnumerable<Customer> GetAll()
	{
		return _db.Customers
			.Include(c => c.Meetings)
			.ThenInclude(m => m.CreatedBy)
			.Include(c => c.Meetings)
			.ThenInclude(m => m.Stat);
	}

	public Customer Update(int id, UpdateCustomerDto dto)
    {
        var customer = GetById(id);

        if (dto.Phone != customer.Phone && _db.Customers.Any(i => i.Phone == dto.Phone))
            throw new ApplicationException($"Customer with phone '{dto.Phone}' already exists");

        _mapper.Map(dto, customer);
        var res = _db.Customers.Update(customer).Entity;
        _db.SaveChanges();

		return res;
    }

	public Customer Delete(int id)
    {
        var customer = GetById(id);

        var res = _db.Customers.Remove(customer).Entity;
        _db.SaveChanges();

		return res;
    }

	private Customer GetById(int id)
	{
		var customer = _db.Customers
			.Include(c => c.Meetings)
			.ThenInclude(m => m.CreatedBy)
			.Include(c => c.Meetings)
			.ThenInclude(m => m.Stat)
			.FirstOrDefault(c => c.Id == id);
        if (customer == null) throw new KeyNotFoundException("Customer not found");
        return customer;
	}
}
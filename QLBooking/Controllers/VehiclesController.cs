using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLBooking.Data;
using QLBooking.Models;

namespace QLBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public VehiclesController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicles>>> GetVehicles()
        {
            return await _context.Vehicles.ToListAsync();
        }

        // GET: api/Vehicles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicles>> GetVehicles(int id)
        {
            var vehicles = await _context.Vehicles.FindAsync(id);

            if (vehicles == null)
            {
                return NotFound();
            }

            return vehicles;
        }

        //Get: tìm kiếm
        [HttpGet("search/{searchText}")]
        public async Task<ActionResult<IEnumerable<Vehicles>>> GetTimKiem(string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText))
            {
                return BadRequest("Văn bản tìm kiếm không được để trống.");
            }

            try
            {
                var vehicles = await _context.Vehicles
                    .Where(v => EF.Functions.Like(v.Type, $"%{searchText}%"))
                    .ToListAsync();

                if (vehicles == null || !vehicles.Any())
                {
                    return NotFound();
                }

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                // Ghi log ngoại lệ sử dụng một framework ghi log
                return StatusCode(500, "Lỗi máy chủ nội bộ");
            }
        }

        // PUT: api/Vehicles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVehicles(int id, Vehicles vehicles)
        {
            if (id != vehicles.Id)
            {
                return BadRequest();
            }

            _context.Entry(vehicles).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehiclesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Vehicles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Vehicles>> PostVehicles(Vehicles vehicles)
        {
            _context.Vehicles.Add(vehicles);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehicles", new { id = vehicles.Id }, vehicles);
        }

        //Post Ảnh
        [Route("SaveFile")]
        [HttpPost]
        public JsonResult SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string fileName = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Photos/" + fileName;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }
                return new JsonResult(fileName);
            }
            catch (Exception)
            {
                return new JsonResult("com.jpg");
            }
        }

        // DELETE: api/Vehicles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicles(int id)
        {
            var vehicles = await _context.Vehicles.FindAsync(id);
            if (vehicles == null)
            {
                return NotFound();
            }

            _context.Vehicles.Remove(vehicles);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VehiclesExists(int id)
        {
            return _context.Vehicles.Any(e => e.Id == id);
        }
    }
}

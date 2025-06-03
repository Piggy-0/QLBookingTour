using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLBooking.Data;
using QLBooking.Models;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Data.SqlClient;
using System.Data;

namespace QLBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhMucController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;


        public DanhMucController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/DanhMuc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> GetTour()
        {
            return await _context.DanhMucs.ToListAsync();
        }

        // GET: api/DanhMuc
        [HttpGet("{id}")]
        public async Task<ActionResult<DanhMuc>> GetDanhMucx(int id)
        {
            var tour = await _context.DanhMucs.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            return tour;
        }

        [HttpGet("GetDanhMuc/{Ten}")]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> GetDanhMuc(string Ten)
        {
            {
                // Sử dụng LINQ để lọc các danh mục có tên bằng Ten
                var danhMuc = await _context.DanhMucs.Where(dm => dm.name == Ten).ToListAsync();

                if (danhMuc == null || danhMuc.Count() == 0)
                {
                    return NotFound();
                }

                return Ok(danhMuc); 
            }
        }


        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutDanhMuc(int id, DanhMuc tour)
        {
            if (id != tour.category_id)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(tour).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourExists(id))
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


        // POST: api/DanhMuc
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DanhMuc>> PostDanhMuc(DanhMuc tour)
        {
            _context.DanhMucs.Add(tour);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTour", new { id = tour.category_id }, tour);
        }



        // DELETE: api/DanhMuc
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var tour = await _context.DanhMucs.FindAsync(id);
            if (tour == null)
            {
                return NotFound();
            }

            _context.DanhMucs.Remove(tour);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        private bool TourExists(int id)
        {
            return _context.DanhMucs.Any(e => e.category_id == id);
        }
    }
}
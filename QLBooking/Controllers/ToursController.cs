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
    public class ToursController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;


        public ToursController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Tours
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tour>>> GetTour()
        {
            return await _context.Tour.ToListAsync();
        }

        // GET: api/Tours/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Tour>> GetTour(int id)
        {
            var tour = await _context.Tour.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            return tour;
        }

        //Get: api/Tours/DanhMuc/id
        // GET: api/Tours/DanhMuc/5
        [HttpGet("DanhMuc/{id:int}")]
        public async Task<ActionResult<IEnumerable<Tour>>> GetToursByDanhMucId(int id)
        {
            // Lấy danh sách các tour dựa trên idDanhMuc
            var tours = await _context.Tour.Where(t => t.category_id == id).ToListAsync();

            // Kiểm tra xem có tour nào được tìm thấy hay không
            if (!tours.Any())
            {
                return NotFound();
            }

            return Ok(tours);
        }


        //Get: tìm kiếm
        [HttpGet("search/{searchText}")]
        public async Task<ActionResult<IEnumerable<Tour>>> GetTimKiem(string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText))
            {
                return BadRequest("Văn bản tìm kiếm không được để trống.");
            }

            try
            {
                var tours = await _context.Tour
                    .Where(t => EF.Functions.Like(t.NoiDen, $"%{searchText}%"))
                    .ToListAsync();

                if (tours == null || !tours.Any())
                {
                    return NotFound();
                }

                return Ok(tours);
            }
            catch (Exception ex)
            {
                // Ghi log ngoại lệ sử dụng một framework ghi log
                return StatusCode(500, "Lỗi máy chủ nội bộ");
            }
        }

        // PUT: api/Tours/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTour(int id, Tour tour)
        {
            if (id != tour.Id)
            {
                return BadRequest();
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

        // POST: api/Tours
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Tour>> PostTour(Tour tour)
        {
            _context.Tour.Add(tour);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTour", new { id = tour.Id }, tour);
        }
        //[HttpPost]
        //public async Task<ActionResult> PostTour([FromForm] Tour tour, IFormFile imageFile)
        //{
        //    if (imageFile != null)
        //    {
        //        var imageName = Path.GetFileName(imageFile.FileName);
        //        var imagePath = Path.Combine(_env.WebRootPath, "/Photos/", imageName);

        //        using (var stream = new FileStream(imagePath, FileMode.Create))
        //        {
        //            await imageFile.CopyToAsync(stream);
        //        }

        //        tour.Anh = imageName;
        //    }
        //    _context.Tour.Add(tour);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetTour", new { id = tour.Id }, tour);
        //}


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

        // DELETE: api/Tours/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var tour = await _context.Tour.FindAsync(id);
            if (tour == null)
            {
                return NotFound();
            }

            _context.Tour.Remove(tour);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        private bool TourExists(int id)
        {
            return _context.Tour.Any(e => e.Id == id);
        }
    }
}

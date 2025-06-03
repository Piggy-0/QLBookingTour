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
    public class DonHangsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly EmailService _emailService;

        public DonHangsController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/DonHangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DonHang>>> GetDonHangs()
        {
            return await _context.DonHangs.ToListAsync();
        }

        // GET: api/DonHangs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DonHang>> GetDonHang(int id)
        {
            var donHang = await _context.DonHangs.FindAsync(id);

            if (donHang == null)
            {
                return NotFound();
            }

            return donHang;
        }

        // PUT: api/DonHangs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDonHang(int id, DonHang donHang)
        {
            if (id != donHang.ID)
            {
                return BadRequest();
            }

            _context.Entry(donHang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonHangExists(id))
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

        // POST: api/DonHangs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPost]
        // public async Task<ActionResult<DonHang>> PostDonHang(DonHang donHang)
        // {
        //    _context.DonHangs.Add(donHang);
        //  await _context.SaveChangesAsync();

        //  return CreatedAtAction("GetDonHang", new { id = donHang.ID }, donHang);
        //}

        [HttpPost]
        public async Task<ActionResult<DonHang>> PostDonHang(DonHang donHang)
        {
            _context.DonHangs.Add(donHang);
            await _context.SaveChangesAsync();

            // Lấy thông tin user để gửi mail
            var user = await _context.User.FirstOrDefaultAsync(u => u.id == donHang.customer_id);
            if (user == null || string.IsNullOrEmpty(user.email))
            {
                return BadRequest("Không tìm thấy email khách hàng.");
            }

            // Lấy thông tin Tour
            var tour = await _context.Tour.FirstOrDefaultAsync(t => t.Id == donHang.IDTour);
            if (tour == null)
            {
                return BadRequest("Không tìm thấy thông tin tour.");
            }


            // Chuẩn bị nội dung email
            var subject = "Xác nhận đặt tour thành công";
            var body = $@"
            <h3>Chào {donHang.Name},</h3>
            <p>Bạn đã đặt tour thành công với:</p>
            <ul>
                <li><b>Tên tour:</b> {tour.Ten}</li>
                <li><b>Giá:</b> {donHang.Gia?.ToString("N0")} VNĐ</li>
                <li><b>Ngày khởi hành:</b> {donHang.NgayKhoiHanh:dd/MM/yyyy}</li>
                <li><b>Trạng thái đơn hàng:</b> {donHang.order_status}</li>
            </ul>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>";

            // Gửi email
            await _emailService.SendEmailAsync(user.email, subject, body);
            return CreatedAtAction("GetDonHang", new { id = donHang.ID }, donHang);
        }


        // DELETE: api/DonHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonHang(int id)
        {
            var donHang = await _context.DonHangs.FindAsync(id);
            if (donHang == null)
            {
                return NotFound();
            }

            _context.DonHangs.Remove(donHang);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class OrderStatusUpdate
        {
            public string OrderStatus { get; set; }
        }

        // PATCH: api/Orders/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchOrderStatus(int id, [FromBody] OrderStatusUpdate orderStatusUpdate)
        {
            if (orderStatusUpdate == null || string.IsNullOrEmpty(orderStatusUpdate.OrderStatus))
            {
                return BadRequest("Order status cannot be empty.");
            }

            // Find the order by ID
            var order = await _context.DonHangs.FindAsync(id);

            if (order == null)
            {
                return NotFound(); // If order not found, return 404
            }

            // Update only the order_status field
            order.order_status = orderStatusUpdate.OrderStatus;

            // Mark the entity as modified
            _context.Entry(order).State = EntityState.Modified;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return NoContent(); // Return 204 No Content after successful update
        }

        private bool DonHangExists(int id)
        {
            return _context.DonHangs.Any(e => e.ID == id);
        }
    }
}

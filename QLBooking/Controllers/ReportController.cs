using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLBooking.Data;
using QLBooking.Models;

namespace QLBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("bookings/history")]
        public async Task<IActionResult> GetBookingReportHistory()
        {
            var reports = await _context.Reports
                .OrderByDescending(r => r.NgayTaoBaoCao)
                .Select(r => new
                {
                    r.Id,
                    r.SoDon,
                    r.DoanhThu,
                    NgayTaoBaoCao = r.NgayTaoBaoCao.ToString("MM/dd/yyyy HH:mm:ss")
                })
                .ToListAsync();

            return Ok(reports);
        }

        [HttpPost("bookings/month")]
        public async Task<IActionResult> CreateReport()
        {
            var startDate = DateTime.Now.AddDays(-30);
            var endDate = DateTime.Now;

            var totalOrders = await _context.DonHangs
                .Where(d => d.NgayKhoiHanh >= startDate && d.NgayKhoiHanh <= endDate)
                .CountAsync();

            var totalRevenue = await _context.DonHangs
                .Where(d => d.NgayKhoiHanh >= startDate && d.NgayKhoiHanh <= endDate)
                .SumAsync(d => d.Gia ?? 0);

            var baoCao = new Report
            {
                SoDon = totalOrders,
                DoanhThu = totalRevenue,
                NgayTaoBaoCao = DateTime.Now
            };

            _context.Reports.Add(baoCao);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                baoCao.SoDon,
                baoCao.DoanhThu,
                NgayTaoBaoCao = baoCao.NgayTaoBaoCao.ToString("MM/dd/yyyy HH:mm:ss")
            });
        }


        // Thêm API xóa báo cáo theo Id
        [HttpDelete("bookings/{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var report = await _context.Reports.FindAsync(id);

            if (report == null)
            {
                return NotFound(new { message = $"Không tìm thấy báo cáo với Id = {id}" });
            }

            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa báo cáo thành công!" });
        }

    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLBooking.Data;
using QLBooking.Models;

namespace QLBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reviews>>> GetReviews()
        {
            return await _context.Reviews.ToListAsync();
        }

        // API: Lấy đánh giá theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound($"Review with ID {id} not found.");
            }
            return Ok(review);
        }

        // POST: api/Reviews
        // API: Thêm đánh giá mới
        [HttpPost]
        public async Task<ActionResult> AddReview(Reviews review)
        {
            // Kiểm tra tính hợp lệ của review
            if (review == null || review.rating < 1 || review.rating > 5)
            {
                return BadRequest("Invalid review data. Rating must be between 1 and 5.");
            }

            // Kiểm tra sản phẩm có tồn tại không
            var productExists = await _context.Tour.AnyAsync(p => p.Id == review.product_id);

            // Kiểm tra người dùng có tồn tại không
            var userExists = await _context.User.AnyAsync(u => u.id == review.user_id);

            // Trả về thông báo lỗi nếu sản phẩm hoặc người dùng không tồn tại
            if (!productExists)
            {
                return NotFound("Product does not exist.");
            }

            if (!userExists)
            {
                return NotFound("User does not exist.");
            }

            // Thêm đánh giá vào cơ sở dữ liệu
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Trả về kết quả thành công với thông tin của đánh giá
            return CreatedAtAction(nameof(GetReviewById), new { id = review.id }, review);
        }

        // API: Lấy tất cả đánh giá cho một sản phẩm
        [HttpGet("tour/{tourId}")]
        public async Task<IActionResult> GetReviewsByTour(int tourId)
        {
            var reviews = await _context.Reviews
                                        .Where(r => r.product_id == tourId)
                                        .ToListAsync();

            if (reviews == null || reviews.Count == 0)
            {
                return NotFound($"No reviews found for product ID {tourId}.");
            }
            return Ok(reviews);
        }

        // API: Lấy tất cả đánh giá của một người dùng
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetReviewsByUser(int userId)
        {
            var reviews = await _context.Reviews
                                        .Where(r => r.user_id == userId)
                                        .FirstOrDefaultAsync();

            if (reviews == null)
            {
                return NotFound($"No reviews found for user ID {userId}.");
            }
            return Ok(reviews);
        }


        // API: Cập nhật đánh giá
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] Reviews updatedReview)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound($"Review with ID {id} not found.");
            }

            review.content = updatedReview.content ?? review.content;
            review.rating = updatedReview.rating;

            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();

            return Ok(review);
        }

        // API: Xóa đánh giá
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound($"Review with ID {id} not found.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLBooking.Data;
using QLBooking.Models;

namespace QLBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users/role/2
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersWithRole2()
        {
            var user = await _context.User.Where(u => u.role_id == 2).ToListAsync();

            if (user == null || user.Count == 0)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserId(int id)
        {
            var userid = await _context.User.FindAsync(id);

            if (userid == null)
            {
                return NotFound();
            }

            return Ok(userid);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        //Đăng ký
        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> DangKy(User user)
        {
            // Kiểm tra nếu thiếu username
            if (string.IsNullOrWhiteSpace(user.username))
            {
                return BadRequest("Username is required");
            }

            // Kiểm tra nếu thiếu password
            if (string.IsNullOrWhiteSpace(user.password))
            {
                return BadRequest("Password is required");
            }

            // Kiểm tra nếu role_id không được cung cấp hoặc được gán bằng 0
            if (user.role_id == 0)
            {
                user.role_id = 2;  // Gán role_id mặc định là 2
            }
            user.create_at = DateTime.Now;

            _context.User.Add(user); // Thêm người dùng vào cơ sở dữ liệu
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu

            // Trả về kết quả với mã trạng thái 201 và đường dẫn đến người dùng vừa tạo
            return CreatedAtAction("GetUserId", new { id = user.id }, user);

        }

        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
        [HttpPost("login")]
        public async Task<ActionResult> DangNhap([FromBody] LoginRequest loginRequest)
        {
            // Validate the input
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                //return BadRequest(new { message = "Username or password is missing" });
                var response = new { message = "Username or password is missing" };
                return BadRequest(response);
            }

            // Check if the user exists in the database
            var user = await _context.User
                .SingleOrDefaultAsync(u => u.username == loginRequest.Username && u.password == loginRequest.Password);

            if (user == null)
            {
                var response = new ResponseModel.LoginResponse
                {
                    Success = false,
                    Message = "Invalid username or password",
                    Role = string.Empty,
                    User = null
                };
                return Unauthorized(response); // Return 401 Unauthorized
            }
            // Determine user role
            var role = user.role_id == 1 ? "Admin" : "User";

            // Prepare success response
            var successResponse = new ResponseModel.LoginResponse
            {
                Success = true,
                Message = $"Login successful - {role}",
                Role = role,
                User = new ResponseModel.UserResponse
                {
                    id = user.id,
                    username = user.username,
                    role_id = user.role_id
                }
            };

            return Ok(successResponse); // Return 200 OK with response
        }

        public class LogoutResult
        {
            public bool Success { get; set; }
            public string Message { get; set; }
        }

        // Đăng xuất
        [HttpPost("logout")]
        public IActionResult DangXuat()
        {

            return Ok(new LogoutResult { Success = true, Message = "Successfully logged out" });
        }


        // DELETE: api/Users/5
        //       [HttpDelete("{id}")]
        //     public async Task<IActionResult> DeleteUser(int id)
        //   {
        //     var user = await _context.User.FindAsync(id);
        //   if (user == null)
        // {
        //   return NotFound();
        //}

        //_context.User.Remove(user);
        //await _context.SaveChangesAsync();

        //return NoContent();
        //}

        // DELETE: api/Users/5
        [HttpDelete("deleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            // Tìm người dùng theo userId
            var user = await _context.User.FindAsync(userId);
            if (user == null)
            {
                return NotFound(); // Trả về 404 nếu không tìm thấy người dùng
            }

            // Tìm tất cả các đơn hàng của người dùng này và thực thi truy vấn
            var ordersList = await _context.DonHangs.Where(o => o.customer_id == userId).ToListAsync();


            // Xóa các đơn hàng của người dùng
            _context.DonHangs.RemoveRange(ordersList);

            // Xóa người dùng
            _context.User.Remove(user);

            // Lưu các thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return NoContent(); // Trả về 204 No Content khi xóa thành công
        }


        // PATCH: api/Users/{id}/password
        [HttpPatch("{id}/password")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] UpdatePasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest("Invalid request data.");
            }

            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (user.password != request.CurrentPassword)
            {
                // return Unauthorized("Current password is incorrect.");
                return Unauthorized(new { message = "Current password is incorrect." });
            }

            // Cập nhật mật khẩu mới
            user.password = request.NewPassword;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Trả về NoContent nếu thành công
        }


        // Model để nhận dữ liệu từ yêu cầu
        public class UpdatePasswordRequest
        {
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
        }
        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.id == id);
        }
    }
}

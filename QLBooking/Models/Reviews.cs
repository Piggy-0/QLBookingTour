using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLBooking.Models
{
    [Table("Reviews")]
    public class Reviews
    {
        [Key]
        public int id { get; set; } // 
        public int product_id { get; set; }
        public int user_id { get; set; }
        public string content { get; set; } // đánh giá
        public int rating { get; set; } // Điểm đánh giá (1-5)
        public DateTime create_at { get; set; } = DateTime.UtcNow; // Thời gian tạo đánh giá
    }
}

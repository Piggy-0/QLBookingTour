using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLBooking.Models
{
    [Table("Tour")]
    public class Tour
    {
        [Key]
        public int Id { get; set; }
        public string? Ten { get; set; }
        public int category_id { get; set; }
        public string? NoiXuatPhat { get; set; }
        public string? NoiDen { get; set; }
        public string? ThoiGian { get; set; }
        public int? Gia { get; set; }
        public string? Anh { get; set; }
        
    }
}

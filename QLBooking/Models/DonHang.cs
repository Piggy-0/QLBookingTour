using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLBooking.Models
{
    [Table("DonHang")]
    public class DonHang
    {
        [Key]
        public int ID { get; set; }
        public int customer_id { get; set; }
        public string order_status { get; set; } 
        public int SoLuong { get; set; }
        public DateTime NgayKhoiHanh { get; set; }
        public int IDTour { get; set; }
        public int IDXe { get; set; }
        public int? Gia { get; set; }
        public string Name { get; set; }
        public string sdt { get; set; }

    }
}

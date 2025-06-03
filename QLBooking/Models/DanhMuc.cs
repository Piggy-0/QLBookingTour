using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLBooking.Models
{
    [Table("DanhMuc")]
    public class DanhMuc
    {
        [Key] public int category_id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
    }
}

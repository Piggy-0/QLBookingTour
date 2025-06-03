using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLBooking.Models
{
    [Table("Report")]
    public class Report
    {
        [Key]
        public int Id { get; set; }
        public int SoDon { get; set; }
        public decimal DoanhThu { get; set; }
        public DateTime NgayTaoBaoCao { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLBooking.Models
{
    [Table("Vehicles")]
    public class Vehicles
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Type { get; set; }
        
    }
}

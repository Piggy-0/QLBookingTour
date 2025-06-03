using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLBooking.Models
{
    [Table("Roles")]
    public class Roles
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)] // Không dùng Identity, vì role_id tự định nghĩa
        public int role_id { get; set; }

        [Required]
        [StringLength(50)]
        public string role_name { get; set; }
    }
}

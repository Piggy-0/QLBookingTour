using Microsoft.EntityFrameworkCore;
using QLBooking.Models;

namespace QLBooking.Data
{
    public class ApplicationDbContext : DbContext
    {
        public  ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
        {
        }

        public DbSet<User> User { get; set; }
        public DbSet<Tour> Tour { get; set; }

        public DbSet<Vehicles> Vehicles { get; set; }
        public DbSet<DanhMuc> DanhMucs { get; set; }
        public DbSet<DonHang> DonHangs { get; set; }
        public DbSet<Reviews> Reviews { get; set; }
        public DbSet<Report> Reports { get; set; }
    }
}

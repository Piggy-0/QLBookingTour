using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLBooking.Migrations
{
    /// <inheritdoc />
    public partial class AddReportTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sdt",
                table: "DonHang",
                newName: "sdt");

            migrationBuilder.AddColumn<DateTime>(
                name: "create_at",
                table: "User",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phone",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "customer_id",
                table: "DonHang",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SoDon = table.Column<int>(type: "int", nullable: false),
                    DoanhThu = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NgayTaoBaoCao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropColumn(
                name: "create_at",
                table: "User");

            migrationBuilder.DropColumn(
                name: "email",
                table: "User");

            migrationBuilder.DropColumn(
                name: "phone",
                table: "User");

            migrationBuilder.DropColumn(
                name: "customer_id",
                table: "DonHang");

            migrationBuilder.RenameColumn(
                name: "sdt",
                table: "DonHang",
                newName: "Sdt");
        }
    }
}

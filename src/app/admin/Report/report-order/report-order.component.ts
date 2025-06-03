import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../Service/report-service';
import { Report } from '../../../Models/report';

@Component({
  selector: 'app-report-order',
  templateUrl: './report-order.component.html',
  styleUrls: ['./report-order.component.css']  // <-- sửa ở đây
})
export class ReportOrderComponent implements OnInit {  // <-- đổi tên class nếu muốn

  reports: Report[] = [];
  message: string = '';

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
  this.reportService.getReportHistory().subscribe({
    next: data => this.reports = data.reverse(), // đảo ngược để bản mới nằm cuối
    error: err => this.message = 'Lỗi khi tải lịch sử báo cáo'
  });
}

  createReport(): void {
  this.reportService.createReport().subscribe({
    next: () => {
      this.loadReports(); // Lấy lại danh sách đầy đủ từ server
    },
    error: err => this.message = 'Lỗi khi tạo báo cáo'
  });
}
    deleteReport(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.loadReports();
        },
        error: () => this.message = 'Lỗi khi xóa báo cáo'
      });
    }
  }
}

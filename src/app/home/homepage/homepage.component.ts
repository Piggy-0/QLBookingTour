import { Component, Input } from '@angular/core';
import { Categories } from '../../Models/categories';
import { CategoriesService } from '../../Service/categories-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

    @Input() DsDanhmuc: Categories[] = [];;
  category_id: any;

  constructor( private danhmucService: CategoriesService, private route: ActivatedRoute){}

  ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.category_id = +params['category_id'];
      // Gọi phương thức để lấy dữ liệu dựa trên category_id
      this.DsDanhMucSp();
    });
  }

  DsDanhMucSp() {
    this.danhmucService.getDsdanhmuc().subscribe(data => {
      this.DsDanhmuc = data;
    });
  }
}

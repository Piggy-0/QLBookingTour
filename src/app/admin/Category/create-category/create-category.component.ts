import { Component, Input } from '@angular/core';
import { Categories } from '../../../Models/categories';
import { CategoriesService } from '../../../Service/categories-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {


  name: string='';
  description: string='';
  @Input() category:Categories;

  constructor (private http: CategoriesService,
    private router: Router
  ){
   }

   ngOnInit(): void {
    this.name = this.category.name;
    this.description = this.category.description;
  }

  themDanhmuc() {
    const val = {
      name : this.name,
      description : this.description,

    }
    this.http.addDsdanhmuc(val).subscribe(
      result => {
        console.log('Thêm thành công', result);
        alert('Thêm thành công!');
        this.router.navigate(['/admin/categories/list']);
      },
      error => {
        console.error('There was an error adding the category!', error);
      }
    );
  }
}

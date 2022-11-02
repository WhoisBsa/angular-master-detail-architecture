import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string = '';
  categoryForm!: FormGroup;
  pageTitle: string = '';
  sererErrorMessages: string[] | null = null;
  submittingForm: boolean = false;
  category: Category = new Category(0, '');

  constructor(
    private _categorySerice: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle()
  }

  //#region Private METHODS
  private setCurrentAction() {
    this.route.snapshot.url[0].path === 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this._categorySerice.getById(+params.get('id')!))
      )
      .subscribe({
        next: category => {
          this.category = category;
          this.categoryForm.patchValue(category);
        },
        error: () => console.log('Erro ao carregar categoria')
      });
    }
  }

  private setPageTitle() {
    this.currentAction === 'new' ?
    this.pageTitle = 'Cadastro de Nova Categoria' :
    this.pageTitle = 'Editando Categoria: ' + this.category.name;
  }
  //#endregion
}

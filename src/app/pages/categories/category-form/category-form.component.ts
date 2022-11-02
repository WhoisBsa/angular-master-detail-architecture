import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import * as toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string = '';
  categoryForm!: FormGroup;
  pageTitle: string = '';
  serverErrorMessages: string[] | null = null;
  submittingForm: boolean = false;
  category: Category = new Category(0, '');

  constructor(
    private _categoryService: CategoryService,
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

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new')
      this.createCategory();
    else
      this.updateCategory();
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
        switchMap(params => this._categoryService.getById(+params.get('id')!))
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

  private createCategory() {
    const category: Category = Object.assign( new Category(0, ''), this.categoryForm.value );

    this._categoryService.create(category)
    .subscribe({
      next: category => this.actionsForSuccess(category),
      error: () => this.actionsForError(category)
    });
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(0, ''), this.categoryForm.value);

    this._categoryService.update(category)
      .subscribe({
        next: category => this.actionsForSuccess(category),
        error: (error) => this.actionsForError(error)
      });
  }

  private actionsForSuccess(category: Category) {
    toastr.success("Solicitação processada com sucesso!");
    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação');

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.']
  }
  //#endregion
}

;;import { AfterContentChecked, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import * as toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Component({
  template: ''
})
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {
  currentAction: string = '';
  resourceForm!: FormGroup;
  pageTitle: string = '';
  serverErrorMessages: string[] | null = null;
  submittingForm: boolean = false;

  protected route!: ActivatedRoute;
  protected router!: Router;
  protected formBuilder!: FormBuilder

  constructor(
    protected injector: Injector,
    protected _baseResourceService: BaseResourceService<T>,
    @Inject('resource') public resource: T,
    @Inject('jsonDataToResourceFn') protected jsonDataToResourceFn: (jsonData: string) => T,
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new')
      this.createResource();
    else
      this.updateResource();
  }

  protected setCurrentAction() {
    this.route.snapshot.url[0].path === 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  protected loadResource() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this._baseResourceService.getById(+params.get('id')!))
      )
        .subscribe({
          next: resource => {
            this.resource = resource;
            this.resourceForm.patchValue(resource);
          },
          error: () => console.log('Erro ao carregar categoria')
        });
    }
  }

  protected setPageTitle() {
    this.currentAction === 'new' ?
      this.pageTitle = this.creationPageTitle() :
      this.pageTitle = this.editionPageTitle();
  }

  protected creationPageTitle(): string {
    return 'Novo'
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this._baseResourceService.create(resource)
      .subscribe({
        next: resource => this.actionsForSuccess(resource),
        error: () => this.actionsForError(resource)
      });
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

    this._baseResourceService.update(resource)
      .subscribe({
        next: resource => this.actionsForSuccess(resource),
        error: (error) => this.actionsForError(error)
      });
  }

  protected actionsForSuccess(resource: T) {
    toastr.success("Solicitação processada com sucesso!");

    const baseComponentPath = this.route.snapshot.parent?.url[0].path;

    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    );
  }

  protected actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação');

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
  }

  protected abstract buildResourceForm(): void;
}

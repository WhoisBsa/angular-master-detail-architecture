import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import * as toastr from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string = '';
  entryForm!: FormGroup;
  pageTitle: string = '';
  serverErrorMessages: string[] | null = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry(0, '');

  constructor(
    private _entrySerice: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle()
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new')
      this.createEntry();
    else
      this.updateEntry();
  }

  //#region Private METHODS
  private setCurrentAction() {
    this.route.snapshot.url[0].path === 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this._entrySerice.getById(+params.get('id')!))
      )
      .subscribe({
        next: entry => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        error: () => console.log('Erro ao carregar lançamento')
      });
    }
  }

  private setPageTitle() {
    this.currentAction === 'new' ?
    this.pageTitle = 'Cadastro de Novo Lançamento' :
    this.pageTitle = 'Editando Lançamento: ' + this.entry.name;
  }

  private createEntry() {
    const entry: Entry = Object.assign( new Entry(0, ''), this.entryForm.value );

    this._entrySerice.create(entry)
    .subscribe({
      next: entry => this.actionsForSuccess(entry),
      error: () => this.actionsForError(entry)
    });
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(0, ''), this.entryForm.value);

    this._entrySerice.update(entry)
      .subscribe({
        next: entry => this.actionsForSuccess(entry),
        error: (error) => this.actionsForError(error)
      });
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success("Solicitação processada com sucesso!");
    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
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

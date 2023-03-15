import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{ errorMessage }}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {
  @Input('formControl') formControl: FormControl | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    }

    return null;
  }

  private mustShowErrorMessage() {
    return this.formControl && this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.formControl?.errors?.['required'])
      return 'Dado obrigatório';
    else if (this.formControl?.errors?.['email'])
      return 'Formato de email inválido';
    else if (this.formControl?.errors?.['minlength'])
      return `Deve ter no mínimo ${this.formControl.errors?.['minlength'].requiredLength} caracteres`;

    return null;
  }

}

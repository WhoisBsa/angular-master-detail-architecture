import { Pipe, PipeTransform } from '@angular/core';

/**
 * Cast super type into type using generics
 * Return Type obtained by assignment type.
 */

@Pipe({ name: 'formControl' })
export class FromControlPipe implements PipeTransform {
  /**
  * Cast (S: SuperType) into (T: Type) using @Generics.
  * @param value S: SuperType obtained from input type.
  * @returns (T: Type) obtained by assignment type.
  */
  transform<S, T extends S>(value: S): T {
    return <T>value;
  }
}

import { Component, OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Component({
  template: ''
})
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {
  resources: T[] = [];

  constructor(private _resourceService: BaseResourceService<T>) { }

  ngOnInit(): void {
    this._resourceService.getAll().subscribe({
      next: resources => this.resources = resources,
      error: () => alert('Erro ao carregar a lista.')
    });
  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    mustDelete && this._resourceService.delete(resource.id).subscribe({
      next: () => this.resources = this.resources.filter(c => c !== resource),
      error: () => alert('Erro ao excluir categoria.')
    });
  }
}

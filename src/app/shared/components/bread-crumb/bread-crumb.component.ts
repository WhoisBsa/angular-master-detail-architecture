import { Component, Input, OnInit } from '@angular/core';

interface BreadCrumbItem {
  text: string,
  link?: string,
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {
  @Input('items') items: BreadCrumbItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  isTheLastItem(item: BreadCrumbItem) {
    const index = this.items.indexOf(item);

    return index === this.items.length - 1;
  }

}

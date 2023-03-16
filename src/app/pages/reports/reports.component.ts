import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Category } from '../categories/shared/category.model';
import { CategoryService } from '../categories/shared/category.service';
import { Entry } from '../entries/shared/entry.model';
import { EntryService } from '../entries/shared/entry.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild('month') month: ElementRef | null = null;
  // @ViewChild('year') year: ElementRef | null = null;

  totalExpense: any = 0;
  totalRevenue: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  categories: Category[] = [];
  entries: Entry[] = [];

  constructor(
    private _entryService: EntryService,
    private _categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this._categoryService.getAll().subscribe(categories => this.categories = categories);
  }

  generateReport() {
    const [year, month] = this.month?.nativeElement.value?.split('-');

    if (!year || !month)
      return alert('Você precisa selecionar uma data para gerar os relatórios');

    this._entryService.getByMonthandYear(+month, +year).subscribe(this.setChartValues.bind(this));
  }

  private setChartValues(entries: Entry[]) {
    this.entries = entries;

    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let totalExpense = 0;
    let totalRevenue = 0;

    this.entries.forEach(entry => {
      const amount = this.formatAmount(entry.amount || '0');
      if (entry.type === 'revenue') totalRevenue += amount;
      else totalExpense += amount;
    });

    const intl = Intl.NumberFormat('pr-BR', { style: 'currency', currency: 'BRL' });

    this.totalExpense = intl.format(totalExpense);
    this.totalRevenue = intl.format(totalRevenue);
    this.balance = intl.format(totalRevenue - totalExpense);
  }

  private formatAmount(amount: string): number {
    return parseFloat(amount.replace('.', '').replace(',', '.'));
  }

  private setChartData() {
    this.revenueChartData = this.getChartDataByType('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartDataByType('expense', 'Gráfico de Despesas', '#E03131');
  }

  private getChartDataByType(type: string, title: string, color: string) {
    const chartData: any[] = [];
    this.categories.forEach(category => {
      const filteredEntries = this.entries.filter(
        entry => entry.categoryId === category.id && entry.type === type
      );

      if (filteredEntries.length) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + this.formatAmount(entry.amount || '0'), 0
        );

        chartData.push({
          categoryName: category.name,
          totalAmount
        });
      }
    });

    return {
      labels: chartData.map(c => c.categoryName),
      datasets: [
        { label: title, backgroundColor: color, data: chartData.map(c => c.totalAmount) }
      ]
    };
  }
}

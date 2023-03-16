import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(c => c.CategoriesModule) },
  { path: 'entries', loadChildren: () => import('./pages/entries/entries.module').then(c => c.EntriesModule) },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(c => c.ReportsModule) },
  { path: '**', redirectTo: 'reports' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

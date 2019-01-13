import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRouters: Routes = [
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: 'home', loadChildren: './tw-home/tw-home.module#TWHomeModule' },
  { path: 'emotion', loadChildren: './tw-emotion/tw-emotion.module#TWEmotionModule' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRouters)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

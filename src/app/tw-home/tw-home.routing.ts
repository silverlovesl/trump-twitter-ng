import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { TWHomeComponent } from './tw-home.component';

export const routes: Routes = [{ path: '', component: TWHomeComponent }];

export const TWHomeRouting: ModuleWithProviders = RouterModule.forChild(routes);

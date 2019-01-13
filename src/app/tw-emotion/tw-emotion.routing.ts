import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { TWEmotionComponent } from './tw-emotion.component';

export const routes: Routes = [{ path: '', component: TWEmotionComponent }];

export const TWEmotionRouting: ModuleWithProviders = RouterModule.forChild(routes);

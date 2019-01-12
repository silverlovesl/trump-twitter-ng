import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountUpModule } from 'countup.js-angular2';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { TWHomeComponent } from './tw-home.component';
import { TWHomeRouting } from './tw-home.routing';
import { StatisticService } from '../services/api/statistic.service';

@NgModule({
  imports: [CountUpModule, NgZorroAntdModule, CommonModule, NgxEchartsModule, TWHomeRouting],
  declarations: [TWHomeComponent],
  providers: [StatisticService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TWHomeModule {}

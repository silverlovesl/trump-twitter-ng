import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { TWEmotionComponent } from './tw-emotion.component';
import { TWEmotionRouting } from './tw-emotion.routing';
import { StatisticService } from '../services/api/statistic.service';

@NgModule({
  imports: [NgZorroAntdModule, CommonModule, NgxEchartsModule, TWEmotionRouting],
  declarations: [TWEmotionComponent],
  providers: [StatisticService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TWEmotionModule {}

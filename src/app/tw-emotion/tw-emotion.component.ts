import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { StatisticService } from '../services/api/statistic.service';
import { Emotion } from '../models/statistic';

@Component({
  selector: 'app-tw-emotion',
  templateUrl: './tw-emotion.component.html',
  styleUrls: ['./tw-emotion.component.scss'],
})
export class TWEmotionComponent extends BaseComponent implements OnInit {
  public isLoading: boolean = false;
  public sentimentIntensityOption: any = {};
  public emotion: Emotion;
  constructor(private statService: StatisticService) {
    super();
  }

  async ngOnInit() {
    this.isLoading = true;
    this.emotion = await this.statService.getEmotion().toPromise();

    setTimeout(() => {
      this.initEmotionOption();
      this.isLoading = false;
    }, 1000);
  }

  private initEmotionOption() {
    this.sentimentIntensityOption = {
      grid: { left: '5%', right: '10%', bottom: '5%', top: '20%', containLabel: true },
      series: [
        {
          name: 'Positive',
          type: 'gauge',
          z: 3,
          center: ['48%', '40%'],
          min: 0,
          max: 100,
          splitNumber: 5,
          radius: '50%',
          axisLine: { lineStyle: { width: 5 } },
          axisTick: { length: 15, lineStyle: { color: 'auto' } },
          splitLine: { length: 10, lineStyle: { color: 'auto' } },
          data: [{ value: this.emotion.positive, name: 'Positive' }],
        },
        {
          name: 'Negative',
          type: 'gauge',
          center: ['15%', '40%'],
          min: 0,
          max: 100,
          splitNumber: 5,
          radius: '35%',
          axisLine: { lineStyle: { width: 5 } },
          axisTick: { length: 15, lineStyle: { color: 'auto' } },
          splitLine: { length: 10, lineStyle: { color: 'auto' } },
          data: [{ value: this.emotion.negative, name: 'Negative' }],
        },
        {
          name: 'Neutral',
          type: 'gauge',
          center: ['80%', '40%'],
          min: 0,
          max: 100,
          splitNumber: 5,
          radius: '35%',
          axisLine: { lineStyle: { width: 5 } },
          axisTick: { length: 15, lineStyle: { color: 'auto' } },
          splitLine: { length: 10, lineStyle: { color: 'auto' } },
          data: [{ value: this.emotion.neutral, name: 'Neutral' }],
        },
      ],
    };
  }
}

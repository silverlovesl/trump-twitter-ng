import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { StatisticType1, StatisticType2, StatisticType3, Emotion } from '@/app/models/statistic';
import { WordCloud } from '@/app/models/word-cloud';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { TWEnum } from '@/app/models/tw-enum';

declare var require: any;

@Injectable()
export class StatisticService {
  constructor(private api: ApiService) {}

  /**
   * Get competency list
   */
  getAnnualStatistic(): Observable<StatisticType1[]> {
    if (environment.isUseMock) {
      const mock = require('@/assets/mock-data/annual-statistic.json');
      return of(mock.data.map((d: any) => new StatisticType1().deserialize(d)));
    }
    return this.api.getAll(StatisticType1, `/annual-statistic`, {});
  }

  getMonthlyStatistic(): Observable<StatisticType2[]> {
    if (environment.isUseMock) {
      const mock = require('@/assets/mock-data/monthly-statistic.json');
      return of(mock.data.map((d: any) => new StatisticType2().deserialize(d)));
    }
    return this.api.getAll(StatisticType2, `/monthly-statistic`, {});
  }

  getHourlyStatistic(): Observable<StatisticType3[]> {
    if (environment.isUseMock) {
      const mock = require('@/assets/mock-data/hourly-statistic.json');
      return of(mock.data.map((d: any) => new StatisticType3().deserialize(d)));
    }
    return this.api.getAll(StatisticType3, `/hourly-statistic`, {});
  }

  getWordCloud(category: TWEnum.WordCategory): Observable<WordCloud[]> {
    if (environment.isUseMock) {
      const mock = require('@/assets/mock-data/word-cloud.json');
      return of(mock.data.map((d: any) => new WordCloud().deserialize(d)));
    }
    let param = category ? { category: category } : {};
    return this.api.getAll(WordCloud, `/word-cloud`, param);
  }

  getEmotion(): Observable<Emotion> {
    const mock = require('@/assets/mock-data/emotion.json');
    return Observable.create(mock).then((d: any) => {
      return new Emotion().deserialize(d);
    });
  }
}

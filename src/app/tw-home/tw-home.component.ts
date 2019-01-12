import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { StatisticService } from '../services/api/statistic.service';
import { StatisticType1, StatisticType2, StatisticType3 } from '../models/statistic';
import { WordCloud } from '../models/word-cloud';
import { TWEnum } from '../models/tw-enum';

declare var require: any;
require('echarts-wordcloud');

@Component({
  selector: 'app-tw-home',
  templateUrl: './tw-home.component.html',
  styleUrls: ['./tw-home.component.scss'],
})
export class TWHomeComponent extends BaseComponent implements OnInit {
  public isLoading: boolean = false;
  public annualTwitteStatChartOptions: any = {};
  public monthlyTwitterStatChartOptions: any = {};
  public hourlyTwitterStatChartOptions: any = {};
  public wordCloudChartOptions: any = {};

  private annualTwitterStat: StatisticType1[];
  private monthlyTwitterStat: StatisticType2[];
  private hourlyTwitterStat: StatisticType3[];
  private wordCloud: WordCloud[];

  constructor(private statService: StatisticService) {
    super();
  }

  async ngOnInit() {
    this.isLoading = true;
    this.annualTwitterStat = await this.statService.getAnnualStatistic().toPromise();
    this.monthlyTwitterStat = await this.statService.getMonthlyStatistic().toPromise();
    this.hourlyTwitterStat = await this.statService.getHourlyStatistic().toPromise();
    this.wordCloud = await this.statService.getWordCloud(TWEnum.WordCategory.Noun).toPromise();

    setTimeout(() => {
      this.initAnnualTwitterStatChart();
      this.initMonthTwitterCountChart();
      this.initHourTwitterCountChart();
      this.initWordCloud();
      this.isLoading = false;
    }, 1000);
  }

  private initAnnualTwitterStatChart() {
    this.annualTwitteStatChartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params: any) => {
          const axisValue = params[0].axisValue;
          return axisValue == '2017' ? '大統領元年' : '';
        },
      },
      grid: { left: '5%', right: '10%', bottom: '5%', top: '10%', containLabel: true },
      xAxis: { type: 'category', name: '年度', data: this.annualTwitterStat.map(d => d.year) },
      yAxis: { type: 'value', name: '件数' },
      series: [
        {
          data: this.annualTwitterStat.map(d => d.count),
          type: 'line',
          label: { offset: [-5, -5], show: true, position: 'bottom', color: '#C23431' },
        },
      ],
    };
  }

  private initMonthTwitterCountChart() {
    const years = this.monthlyTwitterStat.map(d => d.yearWithUnit);
    this.monthlyTwitterStatChartOptions = {
      legend: {
        data: years,
        selected: { '2015年': false, '2016年': false },
      },
      grid: { left: '5%', right: '10%', bottom: '5%', top: '20%', containLabel: true },
      xAxis: {
        type: 'category',
        name: '月度',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(d => `${d}月`),
      },
      yAxis: { type: 'value', name: '件数' },
      series: this.monthlyTwitterStat.map(d => {
        return {
          name: d.yearWithUnit,
          data: d.data.map(v => v.count),
          type: 'bar',
          barWidth: 10,
          markLine: { data: [{ type: 'average', name: '平均值' }] },
          markPoint: {
            data: [{ type: 'max', name: '最大値' }, { type: 'min', name: '最小値' }],
          },
        };
      }),
    };
  }

  private initHourTwitterCountChart() {
    let timeline = [];
    for (let i = 0; i <= 23; i++) {
      timeline.push(`${i}時`);
    }
    this.hourlyTwitterStatChartOptions = {
      baseOption: {
        title: { text: 'Trump一日最初の打ち合わせは午前11時より' },
        timeline: {
          axisType: 'category',
          autoPlay: true,
          playInterval: 5000,
          data: this.hourlyTwitterStat.map(d => `${d.year}年`),
          symbol: `image://${this.twitterIcon}`,
          symbolSize: 15,
        },
        // backgroundColor: '#1b1b1b',
        grid: { left: '2%', right: '2%', bottom: '15%', top: '10%', containLabel: true },
        tooltip: { trigger: 'axis' },
        xAxis: [
          {
            type: 'category',
            data: timeline,
            nameTextStyle: { color: '#fff' },
            axisLabel: { textStyle: { fontSize: 12 }, interval: 0 },
            axisLine: { lineStyle: { color: '#56617b' } },
            splitLine: { show: true, lineStyle: { color: '#2e3547' } },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            splitNumber: 8,
            nameTextStyle: { color: '#56617b' },
            axisLine: { lineStyle: { color: '#56617b' } },
            axisLabel: { formatter: '{value}' },
            // splitLine: { show: true, lineStyle: { color: '#56617b' } },
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                color: function(params: any) {
                  // build a color map as your need.
                  var colorList = [
                    '#eb4848',
                    '#eb6449',
                    '#eb7f49',
                    '#eb9a49',
                    '#ebb549',
                    '#ebd049',
                    '#ebeb49',
                    '#d0eb49',
                    '#b5eb49',
                    '#9aeb49',
                    '#7feb49',
                    '#64eb49',
                    '#49eb49',
                    '#49eb64',
                    '#49eb7f',
                    '#49eb9a',
                    '#49ebb5',
                    '#49ebd0',
                    '#49ebeb',
                    '#49d0eb',
                    '#49b5eb',
                    '#499aeb',
                    '#497feb',
                    '#4964eb',
                    '#4949eb',
                    '#6449eb',
                    '#7f49eb',
                    '#9a49eb',
                    '#b549eb',
                    '#d049eb',
                    '#eb49eb',
                    '#eb49d0',
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      },
      options: this.hourlyTwitterStat.map(d => {
        return { series: { data: d.data.map(v => v.count) } };
      }),
    };
  }

  private initWordCloud() {
    var maskImage = new Image();

    maskImage.onload = e => {
      this.wordCloudChartOptions = {
        series: [
          {
            type: 'wordCloud',
            sizeRange: [10, 100],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 1,
            width: '100%',
            height: '100%',
            maskImage: e.target,
            shape: 'pentagon',
            textStyle: {
              normal: {
                color: function() {
                  return (
                    'rgb(' +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(',') +
                    ')'
                  );
                },
              },
            },
            data: this.wordCloud.map(d => {
              return { name: d.word, value: d.value };
            }),
          },
        ],
      };
    };

    maskImage.src = require('@/assets/image/word-cloud-frame.png');
  }

  get annualTwitterTotal(): number {
    if (this.annualTwitterStat) {
      const index = this.annualTwitterStat.findIndex(d => d.year === 2018);
      if (index > -1) {
        return this.annualTwitterStat[index].count;
      }
    }
    return undefined;
  }

  get annualTwitterAvg(): number {
    if (this.annualTwitterTotal) {
      return Math.ceil(this.annualTwitterTotal / 365);
    }
    return undefined;
  }

  get twitterIcon(): string {
    return require('@/assets/image/twitter.svg');
  }
}

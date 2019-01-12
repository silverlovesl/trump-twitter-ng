import { Serializable } from './serializable';

export class StatisticType1 implements Serializable<StatisticType1> {
  year: number;
  count: number;
  deserialize(input: any) {
    this.year = input.year;
    this.count = input.count;
    return this;
  }
}

export class StatisticType2 implements Serializable<StatisticType2> {
  year: number;
  data: {
    month: number;
    count: number;
  }[];

  deserialize(input: any) {
    this.year = input.year;
    this.data = input.data;
    return this;
  }
  get yearWithUnit(): string {
    return `${this.year}年`;
  }
  get isSelected(): boolean {
    return this.year < 2017;
  }
}

export class StatisticType3 implements Serializable<StatisticType3> {
  year: number;
  data: {
    hour: number;
    count: number;
  }[];

  deserialize(input: any) {
    this.year = input.year;
    this.data = input.data;
    return this;
  }
  get yearWithUnit(): string {
    return `${this.year}年`;
  }
}

export class Emotion implements Serializable<Emotion> {
  negative: number;
  positive: number;
  neutral: number;
  deserialize(input: any) {
    this.negative = input.negative;
    this.positive = input.positive;
    this.neutral = input.neutral;
    return this;
  }
}

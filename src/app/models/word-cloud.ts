import { Serializable } from './serializable';

export class WordCloud implements Serializable<WordCloud> {
  word: string;
  value: number;
  deserialize(input: any) {
    this.word = input.word;
    this.value = input.value;
    return this;
  }
}

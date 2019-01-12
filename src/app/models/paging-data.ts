import { Serializable } from './serializable';
export class PagingData<T extends Serializable<T>> {
  totalRecords: number;
  data: T[];
}

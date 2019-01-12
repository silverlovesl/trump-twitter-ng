import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GlobalState {
  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() {
    this._dataStream$.subscribe(data => this._onEvent(data));
  }

  notifyDataChanged(event, value, notifyEventIfNotUpdated = false) {
    console.log(`event = ${event}`);
    console.log(`value = ${JSON.stringify(value)}`);

    let current = this._data[event];
    if (current !== value || notifyEventIfNotUpdated) {
      this._data[event] = value;

      this._data.next({
        event: event,
        data: this._data[event],
      });
    }
  }

  subscribe(event: string, callback: Function): [string, Function] {
    let subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);

    this._subscriptions.set(event, subscribers);
    return [event, callback];
  }

  unsubscribe(event: string, callback: Function) {
    let subscribers = this._subscriptions.get(event) || [];
    let index = subscribers.indexOf(callback);
    if (index > -1) {
      console.log(`unscribe ${event}`);
      subscribers.splice(index, 1);
      return;
    }
  }

  _onEvent(data: any) {
    let subscribers = this._subscriptions.get(data['event']) || [];

    subscribers.forEach(callback => {
      callback.call(null, data['data']);
    });
  }
}

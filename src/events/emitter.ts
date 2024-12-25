import {
  AnyFunction,
  EventEmitPayload,
  EventOnPayload,
  EventsInfo,
} from './types';

export default class EventEmitter {
  private readonly events: EventsInfo = {};

  constructor(events: EventsInfo = {}) {
    this.events = events;
  }

  public on(eventOnPayload: EventOnPayload): void {
    const { event, eventHandler } = eventOnPayload;
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(eventHandler);
  }

  public emit(eventEmitPayload: EventEmitPayload): void {
    const { event, args } = eventEmitPayload;
    if (!this.events[event]) return;
    this.events[event].forEach((eventHandler: AnyFunction) => {
      eventHandler(...args);
    });
  }
}

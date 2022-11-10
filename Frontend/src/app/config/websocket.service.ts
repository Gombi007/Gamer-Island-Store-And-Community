import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { STRINGS } from './strings.enum';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  uri = STRINGS.SERVER_URL + STRINGS.WEB_SOCKET;
  socket = new SockJS(this.uri);
  stompClient = Stomp.over(this.socket);

  constructor() { }

  subscribe(topic: string, callback: any): void {
    this.stompClient.debug = () => { };
    const connected: boolean = this.stompClient.connected;

    if (connected) {
      this.subscribeToTopic(topic, callback);
      return;
    }

    //If not connected 
    this.stompClient.connect({}, (): any => {
      this.subscribeToTopic(topic, callback);
    });
  }

  private subscribeToTopic(topic: string, callback: any): void {
    this.stompClient.subscribe(topic, (message: any) => {
      callback(message)
    })
  }
}

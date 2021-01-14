import { Injectable } from '@angular/core';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { progressStompConfig, WebSocketService } from './websocket.service';
import { WebSocketOptions } from '../models/websocket.options';
import { Observable } from 'rxjs';


@Injectable()
export class WebSocketEndPointService extends WebSocketService {
  constructor(stompService: RxStompService) {
    super(
      stompService,
      progressStompConfig,
      new WebSocketOptions(['/newFire', '/updateFire', '/ride'])
    );
  }
}
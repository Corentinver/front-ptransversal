import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RxStompService  } from '@stomp/ng2-stompjs';
import { AppComponent } from './app.component';
import { WebSocketEndPointService } from './services/endpoint.websocket.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule
  ],
  providers: [
    RxStompService,
    WebSocketEndPointService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
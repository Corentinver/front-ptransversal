import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RxStompService  } from '@stomp/ng2-stompjs';
import { AppComponent } from './app.component';
import { WebSocketEndPointService } from './services/endpoint.websocket.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { RestService } from './services/rest.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    HttpClientModule
  ],
  providers: [
    RxStompService,
    WebSocketEndPointService,
    RestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
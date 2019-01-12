import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, ja_JP } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';
import { ApiService } from './services/api/api.service';
import { CookieService } from './services/cookie.service';
import { GlobalState } from './services/global-state';

registerLocaleData(ja);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: ja_JP }, ApiService, CookieService, GlobalState],
  bootstrap: [AppComponent],
})
export class AppModule {}

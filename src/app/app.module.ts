import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from './services/startup.services';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ConfigService, CollaborativesearchService } from 'arlas-web-core';
import { AppComponent } from './app.component';
import { ErrormodalComponent, ErrorModalMsgComponent } from './components/errormodal/errormodal.component';
import { MatDialogModule, MatSelectModule } from '@angular/material';
import { WidgetComponent } from './components/widget/widget.component';
import { HistogramModule } from 'arlas-web-components/histogram/histogram.module';
import { PowerbarsModule } from 'arlas-web-components/powerbars/powerbars.module';
export function startupServiceFactory(startupService: ArlasStartupService) {
  const load = () => startupService.load('config.json');
  return load;
}
@NgModule({
  declarations: [
    AppComponent,
    ErrormodalComponent,
    ErrorModalMsgComponent,
    WidgetComponent
  ],
  exports: [AppComponent,WidgetComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpModule,
    HistogramModule,
    MatDialogModule,
    MatSelectModule,
    PowerbarsModule
  ],
  providers: [
    ArlasConfigService,
    ArlasCollaborativesearchService,
    ArlasStartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [ArlasStartupService],
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorModalMsgComponent],
})
export class ArlasToolKitModule { }

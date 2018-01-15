import { Component, OnInit, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ArlasStartupService, ArlasConfigService, ArlasCollaborativesearchService } from '../../services/startup.services';
import { Contributor, CollaborationEvent, OperationEnum } from 'arlas-web-core'
import { contributors } from 'arlas-web-contributors';
import { ChartType, HistogramComponent, Position } from 'arlas-web-components';
import { PowerbarsComponent } from 'arlas-web-components/powerbars/powerbars.component';
import { DataType, DateUnit } from 'arlas-web-contributors/models/models';
import { SwimlaneMode } from 'arlas-web-components/histogram/histogram.utils';

@Component({
  selector: 'arlas-tool-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit, AfterViewInit {

  public chartType = ChartType;

  public componentType;
  public contributor;
  public swimSelected;
  public swimlanes = [];
  public showSwimlaneDropDown: boolean;
  @Input() public contributorId: string;
  @Input() public componentParams: Object;


  @ViewChild('histogram') private histogramComponent: HistogramComponent;
  @ViewChild('swimlane') private swimlaneComponent: HistogramComponent;
  @ViewChild('powerbars') private powerbarsComponent: PowerbarsComponent;

  constructor(private arlasStartupService: ArlasStartupService,
    private cdr: ChangeDetectorRef, private arlasCollaborativesearchService: ArlasCollaborativesearchService) {
  }

  public ngOnInit() {
    this.componentType = this.getComponentType();
    this.contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    if (this.componentType === 'swimlane') {
      this.swimlanes = this.contributor.getConfigValue('swimlanes');
      this.showSwimlaneDropDown = this.swimlanes.length > 1;
      this.swimSelected = this.swimlanes[0];

    }
  }

  public ngAfterViewInit() {
    if (this.histogramComponent) {
      this.setComponentInput(this.histogramComponent);
    }
    if (this.swimlaneComponent) {
      this.setComponentInput(this.swimlaneComponent);
    }
    if (this.powerbarsComponent) {
      this.setComponentInput(this.powerbarsComponent);
    }
  }

  private getComponentType() {
    const contributor: Contributor = this.arlasStartupService.contributorRegistry.get(this.contributorId);
    if (contributor) {
      const contributorPkgName: string = contributor.getPackageName();
      const componenType: string = contributorPkgName.split(".")[contributorPkgName.split(".").length - 1];
      return componenType;
    }
  }

  private setComponentInput(component: any) {
    if (this.componentParams) {
      Object.keys(this.componentParams).forEach(key => {
        if (key === 'chartType') {
          component[key] = ChartType[this.componentParams[key]];
        } else if (key === 'dataType') {
          component[key] = DataType[this.componentParams[key]];
        } else if (key === 'dateUnit') {
          component[key] = DateUnit[this.componentParams[key]];
        } else if (key === 'xAxisPosition') {
          component[key] = Position[this.componentParams[key]];
        } else if (key === 'descriptionPosition') {
          component[key] = Position[this.componentParams[key]];
        } else if (key === 'swimlaneMode') {
          component[key] = SwimlaneMode[this.componentParams[key]];
        } else {
        component[key] = this.componentParams[key];
        }
      })
      this.cdr.detectChanges();
    }
  }

  public changeSwimlane(event) {
    const swimConf = this.swimlanes.filter(f => f.name === event.value)[0];
    this.swimSelected = swimConf;
    this.contributor.aggregations = swimConf.aggregationmodels;
    this.contributor.field = swimConf.field;
    const collaborationEvent: CollaborationEvent = {
      id: 'changeSwimlane',
      operation: OperationEnum.add,
      all: true
    };
    this.arlasCollaborativesearchService.collaborationBus.next(collaborationEvent);

  }
}


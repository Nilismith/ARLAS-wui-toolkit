/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { DataType } from 'arlas-web-contributors/models/models';
import {
    HistogramContributor,
    PowerbarsContributor,
    ResultListContributor,
    SwimLaneContributor
} from 'arlas-web-contributors';
import { ArlasConfigService, ArlasCollaborativesearchService } from './startup.service';
import { DonutContributor } from 'arlas-web-contributors/contributors/DonutContributor';

export class ContributorBuilder {
    public static buildContributor(contributorType: string,
        identifier: string,
        configService: ArlasConfigService,
        collaborativesearchService: ArlasCollaborativesearchService): any {
        const config: Object = configService.getValue('arlas.web.contributors')[contributorType + '$' + identifier];
        let contributor;
        let datatype: string;
        let isOneDimension: boolean;

        switch (contributorType) {
            case 'histogram':
                datatype = config['datatype'];
                isOneDimension = config['isOneDimension'];
                contributor = new HistogramContributor(identifier,
                    DataType[datatype],
                    collaborativesearchService,
                    configService, isOneDimension);
                break;
            case 'powerbars':
                const title: string = config['title'];
                contributor = new PowerbarsContributor(identifier,
                    collaborativesearchService,
                    configService,
                    title);
                break;
            case 'resultlist':
                contributor = new ResultListContributor(identifier,
                    collaborativesearchService,
                    configService);
                break;
            case 'map':
                // TO DO
                break;
            case 'swimlane':
                datatype = config['datatype'];
                isOneDimension = config['isOneDimension'];
                contributor = new SwimLaneContributor(identifier,
                    DataType[datatype],
                    collaborativesearchService,
                    configService);
                break;
            case 'donut':
                const titleDonut: string = config['title'];
                contributor = new DonutContributor(identifier,
                    collaborativesearchService,
                    configService,
                    titleDonut
                  );
                break;
            case 'chipsearch':
                // TO DO
                break;
        }
        return contributor;
    }
}

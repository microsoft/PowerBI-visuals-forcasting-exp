/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
module powerbi.extensibility.visual {

    interface VisualSettingsForecastPlotParams {
        show: boolean;
        forecastLength: number;
       // forecastDate: string;
        seasonType: string;
        errorType: string;
        trendType: string;
        dampingType: string;
        targetSeason: string;
    }

    interface VisualSettingsConfParams {
        show: boolean;
        percentile: number;
        upperConfIntervalFactor: string;
    }
    interface VisualGraphParams {
        show: boolean;
        dataCol: string;
        forecastCol: string;
        percentile: number;
        weight: number;
    }
    interface VisualAdditionalParams {
        show: boolean;
        showWarnings: boolean;
        showInfo: boolean;
        textSize: number;
    }


    export class Visual implements IVisual {
        private imageDiv: HTMLDivElement;
        private imageElement: HTMLImageElement;

        private settings_forecastPlot_params: VisualSettingsForecastPlotParams;
        private settings_conf_params: VisualSettingsConfParams;
        private settings_graph_params: VisualGraphParams;
        private settings_additional_params: VisualAdditionalParams;

        public constructor(options: VisualConstructorOptions) {
            this.imageDiv = document.createElement('div');
            this.imageDiv.className = 'rcv_autoScaleImageContainer';
            options.element.appendChild(this.imageDiv);

            this.imageElement = document.createElement('img');
            this.imageElement.className = 'rcv_autoScaleImage';

            this.imageDiv.appendChild(this.imageElement);

            this.settings_forecastPlot_params = <VisualSettingsForecastPlotParams>{
               
                forecastLength: 10,
             //   forecastDate: "9/25/2010 11:00:00 PM",
                seasonType: "Automatic",
                errorType: "Automatic",
                trendType: "Automatic",
                dampingType: "Automatic", 
                targetSeason: "Automatic"
            };

            this.settings_conf_params = <VisualSettingsConfParams>{
                show: true,
                percentile: 80,
                upperConfIntervalFactor: "0.5",
            };

            this.settings_graph_params = <VisualGraphParams>{
               
                dataCol: "orange",
                forecastCol: "red",
                percentile: 40,
                weight: 10

            };

            this.settings_additional_params = <VisualAdditionalParams>{
              
                showWarnings: false,
                showInfo: true,
                textSize: 10
            };
        }

        public update(options: VisualUpdateOptions) {
            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView: DataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            this.settings_forecastPlot_params = <VisualSettingsForecastPlotParams>{
                //show: getValue<boolean>(dataView.metadata.objects, 'settings_forecastPlot_params', 'show', false),
                forecastLength: getValue<number>(dataView.metadata.objects, 'settings_forecastPlot_params', 'forecastLength', 10),
           //     forecastDate: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'forecastDate', "9/25/2010 11:00:00 PM"),
                seasonType: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'seasonType', "Automatic"),
                errorType: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'errorType', "Automatic"),
                trendType: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'trendType', "Automatic"),
                dampingType: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'dampingType', "Automatic"),
                targetSeason: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'targetSeason', "Automatic")
            };


            this.settings_conf_params = <VisualSettingsConfParams>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings_conf_params', 'show', true),
                percentile: getValue<number>(dataView.metadata.objects, 'settings_conf_params', 'percentile', 80),
                upperConfIntervalFactor: getValue<string>(dataView.metadata.objects, 'settings_conf_params', 'upperConfIntervalFactor', "0.5"),

            }
            this.settings_graph_params = <VisualGraphParams>{
               // show: getValue<boolean>(dataView.metadata.objects, 'settings_graph_params', 'show', false),
                dataCol: getValue<string>(dataView.metadata.objects, 'settings_graph_params', 'dataCol', "orange"),
                forecastCol: getValue<string>(dataView.metadata.objects, 'settings_graph_params', 'forecastCol', "red"),
                percentile: getValue<number>(dataView.metadata.objects, 'settings_graph_params', 'percentile', 40),
                weight: getValue<number>(dataView.metadata.objects, 'settings_graph_params', 'weight', 10),

            }
            this.settings_additional_params = <VisualAdditionalParams>{
                //show: getValue<boolean>(dataView.metadata.objects, 'settings_additional_params', 'show', false),
                showWarnings: getValue<boolean>(dataView.metadata.objects, 'settings_additional_params', 'showWarnings', false),
                showInfo: getValue<boolean>(dataView.metadata.objects, 'settings_additional_params', 'showInfo', true),
                textSize: getValue<number>(dataView.metadata.objects, 'settings_additional_params', 'textSize', 10)
            }

            let imageUrl: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
            }

            if (imageUrl) {
                this.imageElement.src = imageUrl;
            } else {
                this.imageElement.src = null;
            }

            this.onResizing(options.viewport);
        }

        public onResizing(finalViewport: IViewport): void {
            this.imageDiv.style.height = finalViewport.height + 'px';
            this.imageDiv.style.width = finalViewport.width + 'px';
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                case 'settings_forecastPlot_params':
                    if(this.settings_forecastPlot_params.trendType!="None")
                    {
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                           // show: this.settings_forecastPlot_params.show,
                            forecastLength: Math.round(inMinMax(this.settings_forecastPlot_params.forecastLength,1,1000000)),
            //                forecastDate: this.settings_forecastPlot_params.forecastDate,
                            trendType: this.settings_forecastPlot_params.trendType,
                            dampingType: this.settings_forecastPlot_params.dampingType,
                            errorType: this.settings_forecastPlot_params.errorType,
                            seasonType: this.settings_forecastPlot_params.seasonType,
                            targetSeason:this.settings_forecastPlot_params.targetSeason
                        },
                        selector: null
                    });
                    }
                    else
                    {
                        objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            //show: this.settings_forecastPlot_params.show,
                            forecastLength: Math.round(inMinMax(this.settings_forecastPlot_params.forecastLength,1,1000000)),
             //               forecastDate: this.settings_forecastPlot_params.forecastDate,
                            trendType: this.settings_forecastPlot_params.trendType,
                            errorType: this.settings_forecastPlot_params.errorType,
                            seasonType: this.settings_forecastPlot_params.seasonType,                
                        },
                        selector: null
                    }); 
                    }
                    break;

                case 'settings_conf_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings_conf_params.show,
                            percentile: inMinMax(this.settings_conf_params.percentile,0,99),
                            upperConfIntervalFactor: this.settings_conf_params.upperConfIntervalFactor
                        },
                        selector: null
                    });
                    break;

                case 'settings_graph_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            //show: this.settings_graph_params.show,
                            dataCol: this.settings_graph_params.dataCol,
                            forecastCol: this.settings_graph_params.forecastCol,
                            percentile: this.settings_graph_params.percentile,
                            weight: this.settings_graph_params.weight

                        },
                        selector: null
                    });
                    break;

                case 'settings_additional_params':
                    if (this.settings_additional_params.showInfo == true) {
                        objectEnumeration.push({

                            objectName: objectName,
                            properties: {
                               // show: this.settings_additional_params.show,
                                showWarnings: this.settings_additional_params.showWarnings,
                                showInfo: this.settings_additional_params.showInfo,
                                textSize: this.settings_additional_params.textSize
                            },
                            selector: null
                        });
                    }
                    else {
                        objectEnumeration.push({

                            objectName: objectName,
                            properties: {
                               // show: this.settings_additional_params.show,
                                showWarnings: this.settings_additional_params.showWarnings,
                                showInfo: this.settings_additional_params.showInfo,

                            },
                            selector: null
                        });

                    }
                    break;
            };

            return objectEnumeration;
        }
    }
}
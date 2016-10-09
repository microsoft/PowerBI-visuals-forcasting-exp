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

    export interface ScriptResult {
        source: string;
        provider: string;
    }

    interface VisualSettings1 {
        show: boolean;
        forecastLength: number;
        seasonType: string;
        errorType: string;
        trendType: string;
        dampingType: string;
    }

    interface VisualSettings2 {
        show: boolean;
        percentile: number;
        upperConfIntervalFactor: string;
    }
    interface VisualSettings3 {
        show: boolean;
        dataCol: string;
        forecastCol: string;
        percentile: number;
        weight: number;
    }
    interface VisualSettings4 {
        show: boolean;
        showWarnings: boolean;
        showInfo: boolean;
        textSize: number;
    }


    export class Visual implements IVisual {
        private imageDiv: HTMLDivElement;
        private imageElement: HTMLImageElement;

        private settings1: VisualSettings1;
        private settings2: VisualSettings2;
        private settings3: VisualSettings3;
        private settings4: VisualSettings4;

        public constructor(options: VisualConstructorOptions) {
            this.imageDiv = document.createElement('div');
            this.imageDiv.className = 'rcv_autoScaleImageContainer';
            options.element.appendChild(this.imageDiv);

            this.imageElement = document.createElement('img');
            this.imageElement.className = 'rcv_autoScaleImage';

            this.imageDiv.appendChild(this.imageElement);

            this.settings1 = <VisualSettings1>{
                show: false,
                forecastLength: 10,
                seasonType: "Automatic",
                errorType: "Automatic",
                trendType: "Automatic",
                dampingType: "Automatic"
            };

            this.settings2 = <VisualSettings2>{
                show: true,
                percentile: 80,
                upperConfIntervalFactor: "0.5",
            };

            this.settings3 = <VisualSettings3>{
                show: false,
                dataCol: "orange",
                forecastCol: "red",
                percentile: 40,
                weight: 10

            };

            this.settings4 = <VisualSettings4>{
                show: false,
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

            this.settings1 = <VisualSettings1>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings1', 'show', false),
                forecastLength: getValue<number>(dataView.metadata.objects, 'settings1', 'forecastLength', 10),

                seasonType: getValue<string>(dataView.metadata.objects, 'settings1', 'seasonType', "Automatic"),
                errorType: getValue<string>(dataView.metadata.objects, 'settings1', 'errorType', "Automatic"),
                trendType: getValue<string>(dataView.metadata.objects, 'settings1', 'trendType', "Automatic"),
                dampingType: getValue<string>(dataView.metadata.objects, 'settings1', 'dampingType', "Automatic")
            };


            this.settings2 = <VisualSettings2>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings2', 'show', true),
                percentile: getValue<number>(dataView.metadata.objects, 'settings2', 'percentile', 80),
                upperConfIntervalFactor: getValue<string>(dataView.metadata.objects, 'settings2', 'upperConfIntervalFactor', "0.5"),

            }
            this.settings3 = <VisualSettings3>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings3', 'show', false),
                dataCol: getValue<string>(dataView.metadata.objects, 'settings3', 'dataCol', "orange"),
                forecastCol: getValue<string>(dataView.metadata.objects, 'settings3', 'forecastCol', "red"),
                percentile: getValue<number>(dataView.metadata.objects, 'settings3', 'percentile', 40),
                weight: getValue<number>(dataView.metadata.objects, 'settings3', 'weight', 10),

            }
            this.settings4 = <VisualSettings4>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings4', 'show', false),
                showWarnings: getValue<boolean>(dataView.metadata.objects, 'settings4', 'showWarnings', false),
                showInfo: getValue<boolean>(dataView.metadata.objects, 'settings4', 'showInfo', true),
                textSize: getValue<number>(dataView.metadata.objects, 'settings4', 'textSize', 10)
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
                case 'settings1':
                    if(this.settings1.trendType!="None")
                    {
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings1.show,
                            forecastLength: Math.round(inMinMax(this.settings1.forecastLength,1,1000000)),
                            trendType: this.settings1.trendType,
                            dampingType: this.settings1.dampingType,
                            errorType: this.settings1.errorType,
                            seasonType: this.settings1.seasonType,
                            
                        },
                        selector: null
                    });
                    }
                    else
                    {
                        objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings1.show,
                            forecastLength: Math.round(inMinMax(this.settings1.forecastLength,1,1000000)),
                            trendType: this.settings1.trendType,
                            errorType: this.settings1.errorType,
                            seasonType: this.settings1.seasonType,                
                        },
                        selector: null
                    }); 
                    }
                    break;

                case 'settings2':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings2.show,
                            percentile: inMinMax(this.settings2.percentile,0,99),
                            upperConfIntervalFactor: this.settings2.upperConfIntervalFactor
                        },
                        selector: null
                    });
                    break;

                case 'settings3':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings3.show,
                            dataCol: this.settings3.dataCol,
                            forecastCol: this.settings3.forecastCol,
                            percentile: this.settings3.percentile,
                            weight: this.settings3.weight

                        },
                        selector: null
                    });
                    break;

                case 'settings4':
                    if (this.settings4.showInfo == true) {
                        objectEnumeration.push({

                            objectName: objectName,
                            properties: {
                                show: this.settings4.show,
                                showWarnings: this.settings4.showWarnings,
                                showInfo: this.settings4.showInfo,
                                textSize: this.settings4.textSize
                            },
                            selector: null
                        });
                    }
                    else {
                        objectEnumeration.push({

                            objectName: objectName,
                            properties: {
                                show: this.settings4.show,
                                showWarnings: this.settings4.showWarnings,
                                showInfo: this.settings4.showInfo,

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
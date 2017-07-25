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

     // in order to improve the performance, one can update the <head> only in the initial rendering.
    // set to 'true' if you are using different packages to create the widgets
    const updateHTMLHead: boolean = false;
    const renderVisualUpdateType: number[] = [VisualUpdateType.Resize, VisualUpdateType.ResizeEnd, VisualUpdateType.Resize + VisualUpdateType.ResizeEnd];


    interface VisualSettingsForecastPlotParams {
        show: boolean;
        forecastLength: number;
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
       // showWarnings: boolean;
        showInfo: boolean;
        textSize: number;
    }


    export class Visual implements IVisual {
       //    private imageDiv: HTMLDivElement;
        //   private imageElement: HTMLImageElement;
        //HTML
        private rootElement: HTMLElement;
        private headNodes: Node[];
        private bodyNodes: Node[];




        private settings_forecastPlot_params: VisualSettingsForecastPlotParams;
        private settings_conf_params: VisualSettingsConfParams;
        private settings_graph_params: VisualGraphParams;
        private settings_additional_params: VisualAdditionalParams;

        public constructor(options: VisualConstructorOptions) {
            // HTML 
             if(options && options.element)
                this.rootElement = options.element;

            this.headNodes = [];
            this.bodyNodes = [];

            // default parameters
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
           
           //     showWarnings: false,
                showInfo: true,
                textSize: 10
            };
        }

        public update(options: VisualUpdateOptions) {
             if (!options || !options.type || !options.viewport)
                return;

            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView: DataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            this.updateObjects(dataView.metadata.objects);

            let payloadBase64: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                payloadBase64 = dataView.scriptResult.payloadBase64;
            }

            if (renderVisualUpdateType.indexOf(options.type) === -1) {
                if (payloadBase64) {
                    this.injectCodeFromPayload(payloadBase64);
                }
            }
            
            this.onResizing(options.viewport);
        }

// HTML 
         public onResizing(finalViewport: IViewport): void {
            /* add code to handle resizing of the view port */
        }

   private injectCodeFromPayload(payloadBase64: string): void {
            // Inject HTML from payload, created in R
            // the code is injected to the 'head' and 'body' sections.
            // if the visual was already rendered, the previous DOM elements are cleared

            ResetInjector();

            if (!payloadBase64) 
                return

            // create 'virtual' HTML, so parsing is easier
            let el: HTMLHtmlElement = document.createElement('html');
            try {
                el.innerHTML = window.atob(payloadBase64);
            } catch (err) {
                return;
            }

            // if 'updateHTMLHead == false', then the code updates the header data only on the 1st rendering
            // this option allows loading and parsing of large and recurring scripts only once.
            if (updateHTMLHead || this.headNodes.length === 0) {
                while (this.headNodes.length > 0) {
                    let tempNode: Node = this.headNodes.pop();
                    document.head.removeChild(tempNode);
                }
                let headList: NodeListOf<HTMLHeadElement> = el.getElementsByTagName('head');
                if (headList && headList.length > 0) {
                    let head: HTMLHeadElement = headList[0];
                    this.headNodes = ParseElement(head, document.head);
                }
            }

            // update 'body' nodes, under the rootElement
            while (this.bodyNodes.length > 0) {
                let tempNode: Node = this.bodyNodes.pop();
                this.rootElement.removeChild(tempNode);
            }
            let bodyList: NodeListOf<HTMLBodyElement> = el.getElementsByTagName('body');
            if (bodyList && bodyList.length > 0) {
                let body: HTMLBodyElement = bodyList[0];
                this.bodyNodes = ParseElement(body, this.rootElement);
            }

            RunHTMLWidgetRenderer();
        }



 /**
         * This function gets called by the update function above. You should read the new values of the properties into 
         * your settings object so you can use the new value in the enumerateObjectInstances function below.
         * 
         * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
         * This object and property should be first defined in the capabilities.json file in the objects section.
         * In this code we get the property value from the objects (and have a default value in case the property is undefined)
         */
        public updateObjects(objects: DataViewObjects) {
            /*this.settings = <VisualSettings>{
                lineColor: getFillValue(object, 'settings', 'lineColor', "#333333")
            };*/
            
            this.settings_forecastPlot_params = <VisualSettingsForecastPlotParams>{
                //show: getValue<boolean>(dataView.metadata.objects, 'settings_forecastPlot_params', 'show', false),
                forecastLength: getValue<number>(objects, 'settings_forecastPlot_params', 'forecastLength', 10),
           //     forecastDate: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'forecastDate', "9/25/2010 11:00:00 PM"),
                seasonType: getValue<string>(objects, 'settings_forecastPlot_params', 'seasonType', "Automatic"),
                errorType: getValue<string>(objects, 'settings_forecastPlot_params', 'errorType', "Automatic"),
                trendType: getValue<string>(objects, 'settings_forecastPlot_params', 'trendType', "Automatic"),
                dampingType: getValue<string>(objects, 'settings_forecastPlot_params', 'dampingType', "Automatic"),
                targetSeason: getValue<string>(objects, 'settings_forecastPlot_params', 'targetSeason', "Automatic")
            };


            this.settings_conf_params = <VisualSettingsConfParams>{
                show: getValue<boolean>( objects, 'settings_conf_params', 'show', true),
                percentile: getValue<number>( objects, 'settings_conf_params', 'percentile', 80),
                upperConfIntervalFactor: getValue<string>( objects, 'settings_conf_params', 'upperConfIntervalFactor', "0.5"),

            };
            this.settings_graph_params = <VisualGraphParams>{
               // show: getValue<boolean>( objects, 'settings_graph_params', 'show', false),
                dataCol: getValue<string>( objects, 'settings_graph_params', 'dataCol', "orange"),
                forecastCol: getValue<string>( objects, 'settings_graph_params', 'forecastCol', "red"),
                percentile: getValue<number>( objects, 'settings_graph_params', 'percentile', 40),
                weight: getValue<number>( objects, 'settings_graph_params', 'weight', 10),

            };
            this.settings_additional_params = <VisualAdditionalParams>{

                //show: getValue<boolean>( objects, 'settings_additional_params', 'show', false),
             //   showWarnings: getValue<boolean>( objects, 'settings_additional_params', 'showWarnings', false),
                showInfo: getValue<boolean>( objects, 'settings_additional_params', 'showInfo', true),
                textSize: getValue<number>( objects, 'settings_additional_params', 'textSize', 10)
            }
        }



        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                case 'settings_forecastPlot_params':
                    if (this.settings_forecastPlot_params.trendType !== "None") {
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {

                        
                            forecastLength: Math.round(inMinMax(this.settings_forecastPlot_params.forecastLength,1,12000)),
                            trendType: this.settings_forecastPlot_params.trendType,
                            dampingType: this.settings_forecastPlot_params.dampingType,
                            errorType: this.settings_forecastPlot_params.errorType,
                            seasonType: this.settings_forecastPlot_params.seasonType,
                            targetSeason: this.settings_forecastPlot_params.targetSeason
                        },
                        selector: null
                    });
                    }
                    else {
                        objectEnumeration.push({
                        objectName: objectName,
                        properties: {

                        
                            forecastLength: Math.round(inMinMax(this.settings_forecastPlot_params.forecastLength,1,100000)),
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
                            percentile: inMinMax(this.settings_conf_params.percentile, 0, 99),
                            upperConfIntervalFactor: this.settings_conf_params.upperConfIntervalFactor
                        },
                        selector: null
                    });
                    break;

                case 'settings_graph_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                       
                            dataCol: this.settings_graph_params.dataCol,
                            forecastCol: this.settings_graph_params.forecastCol,
                            percentile: this.settings_graph_params.percentile,
                            weight: inMinMax(this.settings_graph_params.weight, 1,50)

                        },
                        selector: null
                    });
                    break;

                case 'settings_additional_params':
                    if (this.settings_additional_params.showInfo === true) {
                        objectEnumeration.push({

                            objectName: objectName,
                            properties: {
                             
                           //     showWarnings: this.settings_additional_params.showWarnings,
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
                          
           //                     showWarnings: this.settings_additional_params.showWarnings,
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
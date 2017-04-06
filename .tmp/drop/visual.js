var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML;
            (function (PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML) {
                var injectorCounter = 0;
                function ResetInjector() {
                    injectorCounter = 0;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.ResetInjector = ResetInjector;
                function injectorReady() {
                    return injectorCounter === 0;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.injectorReady = injectorReady;
                function ParseElement(el, target) {
                    var arr = [];
                    if (!el || !el.hasChildNodes())
                        return;
                    var nodes = el.children;
                    for (var i = 0; i < nodes.length; i++) {
                        var tempNode = void 0;
                        if (nodes.item(i).nodeName.toLowerCase() === 'script') {
                            tempNode = createScriptNode(nodes.item(i));
                        }
                        else {
                            tempNode = nodes.item(i).cloneNode(true);
                        }
                        target.appendChild(tempNode);
                        arr.push(tempNode);
                    }
                    return arr;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.ParseElement = ParseElement;
                function createScriptNode(refNode) {
                    var script = document.createElement('script');
                    var attr = refNode.attributes;
                    for (var i = 0; i < attr.length; i++) {
                        script.setAttribute(attr[i].name, attr[i].textContent);
                        if (attr[i].name.toLowerCase() === 'src') {
                            // waiting only for src to finish loading
                            injectorCounter++;
                            script.onload = function () {
                                injectorCounter--;
                            };
                        }
                    }
                    script.innerHTML = refNode.innerHTML;
                    return script;
                }
                function RunHTMLWidgetRenderer() {
                    var intervalVar = window.setInterval(function () {
                        if (injectorReady()) {
                            window.clearInterval(intervalVar);
                            if (window.hasOwnProperty('HTMLWidgets') && window['HTMLWidgets'].staticRender) {
                                window['HTMLWidgets'].staticRender();
                            }
                        }
                    }, 100);
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.RunHTMLWidgetRenderer = RunHTMLWidgetRenderer;
            })(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML = visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML || (visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML;
            (function (PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML) {
                /**
                 * Gets property value for a particular object.
                 *
                 * @function
                 * @param {DataViewObjects} objects - Map of defined objects.
                 * @param {string} objectName       - Name of desired object.
                 * @param {string} propertyName     - Name of desired property.
                 * @param {T} defaultValue          - Default value of desired property.
                 */
                function getValue(objects, objectName, propertyName, defaultValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue = getValue;
                /**
                 * Gets property value for a particular object.
                 *
                 * @function
                 * @param {DataViewObjects} objects - Map of defined objects.
                 * @param {string} objectName       - Name of desired object.
                 * @param {string} propertyName     - Name of desired property.
                 * @param {T} defaultValue          - Default value of desired property.
                 */
                function getValueMinMax(objects, objectName, propertyName, defaultValue, minVal, maxVal) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property < minVal) {
                                return minVal;
                            }
                            if (property > maxVal) {
                                return maxVal;
                            }
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValueMinMax = getValueMinMax;
                /**
                * Gets property value for a particular object.
                *
                * @function
                * @param {DataViewObjects} objects - Map of defined objects.
                * @param {string} objectName       - Name of desired object.
                * @param {string} propertyName     - Name of desired property.
                * @param {T} defaultValue          - Default value of desired property.
                */
                function getValueNumberMinMax(objects, objectName, propertyName, defaultValue, minValue, maxValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                if (property > maxValue) {
                                    return maxValue;
                                }
                                if (property < minValue) {
                                    return minValue;
                                }
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValueNumberMinMax = getValueNumberMinMax;
                /**
                     * Gets conditional property value for a particular object of type string
                     *
                     * @function
                     * @param {string} inVal     -  current value of parameter
                     * @param {string} contrVal   - control value
                     * @param {string} contrVal2Compare     - specific string to be compared with contrVal
                     * @param {boolean} logic          -  true / false "logic"
                     * @param {string} outValIfCondTrue          - output value if comparison (contrVal == contrVal2Compare) comes out as "logic"
                     */
                function ifStringReturnString(inVal, contrVal, contrVal2Compare, outValIfCondTrue, logic, applyNow) {
                    if (applyNow && contrVal == contrVal2Compare && logic == true)
                        return outValIfCondTrue;
                    if (applyNow && contrVal != contrVal2Compare && logic == false)
                        return outValIfCondTrue;
                    return inVal;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.ifStringReturnString = ifStringReturnString;
                function ifStringReturnStringClustersMethod(numClustersMethods, numOfClusters) {
                    if (numOfClusters != "auto")
                        return "None";
                    if (numOfClusters == "auto" && numClustersMethods == "None")
                        return "fast";
                    return numClustersMethods;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.ifStringReturnStringClustersMethod = ifStringReturnStringClustersMethod;
                function inMinMax(a, mi, ma) {
                    if (a < mi)
                        return mi;
                    if (a > ma)
                        return ma;
                    return a;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.inMinMax = inMinMax;
                /**
                 * Gets property value for a particular object in a category.
                 *
                 * @function
                 * @param {DataViewCategoryColumn} category - List of category objects.
                 * @param {number} index                    - Index of category object.
                 * @param {string} objectName               - Name of desired object.
                 * @param {string} propertyName             - Name of desired property.
                 * @param {T} defaultValue                  - Default value of desired property.
                 */
                function getCategoricalObjectValue(category, index, objectName, propertyName, defaultValue) {
                    var categoryObjects = category.objects;
                    if (categoryObjects) {
                        var categoryObject = categoryObjects[index];
                        if (categoryObject) {
                            var object = categoryObject[objectName];
                            if (object) {
                                var property = object[propertyName];
                                if (property !== undefined) {
                                    return property;
                                }
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getCategoricalObjectValue = getCategoricalObjectValue;
            })(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML = visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML || (visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML;
            (function (PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML) {
                // in order to improve the performance, one can update the <head> only in the initial rendering.
                // set to 'true' if you are using different packages to create the widgets
                var updateHTMLHead = false;
                var renderVisualUpdateType = [powerbi.VisualUpdateType.Resize, powerbi.VisualUpdateType.ResizeEnd, powerbi.VisualUpdateType.Resize + powerbi.VisualUpdateType.ResizeEnd];
                var Visual = (function () {
                    function Visual(options) {
                        // HTML 
                        if (options && options.element)
                            this.rootElement = options.element;
                        this.headNodes = [];
                        this.bodyNodes = [];
                        // default parameters
                        this.settings_forecastPlot_params = {
                            forecastLength: 10,
                            //   forecastDate: "9/25/2010 11:00:00 PM",
                            seasonType: "Automatic",
                            errorType: "Automatic",
                            trendType: "Automatic",
                            dampingType: "Automatic",
                            targetSeason: "Automatic"
                        };
                        this.settings_conf_params = {
                            show: true,
                            percentile: 80,
                            upperConfIntervalFactor: "0.5",
                        };
                        this.settings_graph_params = {
                            dataCol: "orange",
                            forecastCol: "red",
                            percentile: 40,
                            weight: 10
                        };
                        this.settings_additional_params = {
                            //     showWarnings: false,
                            showInfo: true,
                            textSize: 10
                        };
                    }
                    Visual.prototype.update = function (options) {
                        if (!options || !options.type || !options.viewport)
                            return;
                        var dataViews = options.dataViews;
                        if (!dataViews || dataViews.length === 0)
                            return;
                        var dataView = dataViews[0];
                        if (!dataView || !dataView.metadata)
                            return;
                        this.updateObjects(dataView.metadata.objects);
                        var payloadBase64 = null;
                        if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                            payloadBase64 = dataView.scriptResult.payloadBase64;
                        }
                        if (renderVisualUpdateType.indexOf(options.type) === -1) {
                            if (payloadBase64) {
                                this.injectCodeFromPayload(payloadBase64);
                            }
                        }
                        this.onResizing(options.viewport);
                    };
                    // HTML 
                    Visual.prototype.onResizing = function (finalViewport) {
                        /* add code to handle resizing of the view port */
                    };
                    Visual.prototype.injectCodeFromPayload = function (payloadBase64) {
                        // Inject HTML from payload, created in R
                        // the code is injected to the 'head' and 'body' sections.
                        // if the visual was already rendered, the previous DOM elements are cleared
                        PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.ResetInjector();
                        if (!payloadBase64)
                            return;
                        // create 'virtual' HTML, so parsing is easier
                        var el = document.createElement('html');
                        try {
                            el.innerHTML = window.atob(payloadBase64);
                        }
                        catch (err) {
                            return;
                        }
                        // if 'updateHTMLHead == false', then the code updates the header data only on the 1st rendering
                        // this option allows loading and parsing of large and recurring scripts only once.
                        if (updateHTMLHead || this.headNodes.length === 0) {
                            while (this.headNodes.length > 0) {
                                var tempNode = this.headNodes.pop();
                                document.head.removeChild(tempNode);
                            }
                            var headList = el.getElementsByTagName('head');
                            if (headList && headList.length > 0) {
                                var head = headList[0];
                                this.headNodes = PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.ParseElement(head, document.head);
                            }
                        }
                        // update 'body' nodes, under the rootElement
                        while (this.bodyNodes.length > 0) {
                            var tempNode = this.bodyNodes.pop();
                            this.rootElement.removeChild(tempNode);
                        }
                        var bodyList = el.getElementsByTagName('body');
                        if (bodyList && bodyList.length > 0) {
                            var body = bodyList[0];
                            this.bodyNodes = PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.ParseElement(body, this.rootElement);
                        }
                        PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.RunHTMLWidgetRenderer();
                    };
                    /**
                            * This function gets called by the update function above. You should read the new values of the properties into
                            * your settings object so you can use the new value in the enumerateObjectInstances function below.
                            *
                            * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
                            * This object and property should be first defined in the capabilities.json file in the objects section.
                            * In this code we get the property value from the objects (and have a default value in case the property is undefined)
                            */
                    Visual.prototype.updateObjects = function (objects) {
                        /*this.settings = <VisualSettings>{
                            lineColor: getFillValue(object, 'settings', 'lineColor', "#333333")
                        };*/
                        this.settings_forecastPlot_params = {
                            //show: getValue<boolean>(dataView.metadata.objects, 'settings_forecastPlot_params', 'show', false),
                            forecastLength: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_forecastPlot_params', 'forecastLength', 10),
                            //     forecastDate: getValue<string>(dataView.metadata.objects, 'settings_forecastPlot_params', 'forecastDate', "9/25/2010 11:00:00 PM"),
                            seasonType: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_forecastPlot_params', 'seasonType', "Automatic"),
                            errorType: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_forecastPlot_params', 'errorType', "Automatic"),
                            trendType: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_forecastPlot_params', 'trendType', "Automatic"),
                            dampingType: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_forecastPlot_params', 'dampingType', "Automatic"),
                            targetSeason: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_forecastPlot_params', 'targetSeason', "Automatic")
                        };
                        this.settings_conf_params = {
                            show: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_conf_params', 'show', true),
                            percentile: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_conf_params', 'percentile', 80),
                            upperConfIntervalFactor: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_conf_params', 'upperConfIntervalFactor', "0.5"),
                        };
                        this.settings_graph_params = {
                            // show: getValue<boolean>( objects, 'settings_graph_params', 'show', false),
                            dataCol: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_graph_params', 'dataCol', "orange"),
                            forecastCol: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_graph_params', 'forecastCol', "red"),
                            percentile: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_graph_params', 'percentile', 40),
                            weight: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_graph_params', 'weight', 10),
                        };
                        this.settings_additional_params = {
                            //show: getValue<boolean>( objects, 'settings_additional_params', 'show', false),
                            //   showWarnings: getValue<boolean>( objects, 'settings_additional_params', 'showWarnings', false),
                            showInfo: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_additional_params', 'showInfo', true),
                            textSize: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.getValue(objects, 'settings_additional_params', 'textSize', 10)
                        };
                    };
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'settings_forecastPlot_params':
                                if (this.settings_forecastPlot_params.trendType != "None") {
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        properties: {
                                            forecastLength: Math.round(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.inMinMax(this.settings_forecastPlot_params.forecastLength, 1, 12000)),
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
                                            forecastLength: Math.round(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.inMinMax(this.settings_forecastPlot_params.forecastLength, 1, 100000)),
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
                                        percentile: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.inMinMax(this.settings_conf_params.percentile, 0, 99),
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
                                        weight: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.inMinMax(this.settings_graph_params.weight, 1, 50)
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_additional_params':
                                if (this.settings_additional_params.showInfo == true) {
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
                        }
                        ;
                        return objectEnumeration;
                    };
                    return Visual;
                }());
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.Visual = Visual;
            })(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML = visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML || (visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML = {
                name: 'PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML',
                displayName: 'Forecasting',
                class: 'Visual',
                version: '1.0.3',
                apiVersion: '1.4.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map
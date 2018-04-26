/*
 *  Power BI Visualizations
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
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
  export function inMinMax(a: number, mi: number, ma: number) {
    if (a < mi)
      return mi;
    if (a > ma)
      return ma;
    return a;
  }
  export class VisualSettings extends DataViewObjectsParser {
    public settings_forecastPlot_params: SettingsForecastPlotParams = new SettingsForecastPlotParams();
    public settings_conf_params: SettingsConfParams = new SettingsConfParams();
    public settings_graph_params: SettingsGraphParams = new SettingsGraphParams();
    public settings_additional_params: SettingsAdditionalParams = new SettingsAdditionalParams();
    public settings_export_params: SettingsExportParams = new SettingsExportParams();
  }
  export class SettingsForecastPlotParams {
    public forecastLength: number = 10;
    public seasonType: string = "Automatic";
    public errorType: string = "Automatic";
    public trendType: string = "Automatic";
    public dampingType: string = "Automatic";
    public targetSeason: string = "Automatic";
  }
  export class SettingsConfParams {
    public show: boolean = true;
    public confInterval1: string = "0.8";
    public confInterval2: string = "0.95";
  }
  export class SettingsGraphParams {
    public dataCol: string = "orange";
    public forecastCol: string = "red";
    public percentile: number = 40;
    public weight: number = 10;
  }
  export class SettingsAdditionalParams {
    public showInfo: boolean = true;
    public textSize: number = 10;
  }
  export class SettingsExportParams {
    public show: boolean = false;
    public limitExportSize: string = "10000";
    public method: string = "copy";
  }
}

var powerbi;!function(e){!function(e){!function(e){!function(e){function t(){r=0}function a(){return 0===r}function s(e,t){var a=[];if(e&&e.hasChildNodes()){for(var s=e.children,n=0;n<s.length;n++){var r=void 0;r="script"===s.item(n).nodeName.toLowerCase()?i(s.item(n)):s.item(n).cloneNode(!0),t.appendChild(r),a.push(r)}return a}}function i(e){for(var t=document.createElement("script"),a=e.attributes,s=0;s<a.length;s++)t.setAttribute(a[s].name,a[s].textContent),"src"===a[s].name.toLowerCase()&&(r++,t.onload=function(){r--});return t.innerHTML=e.innerHTML,t}function n(){var e=window.setInterval(function(){a()&&(window.clearInterval(e),window.hasOwnProperty("HTMLWidgets")&&window.HTMLWidgets.staticRender&&window.HTMLWidgets.staticRender())},100)}var r=0;e.ResetInjector=t,e.injectorReady=a,e.ParseElement=s,e.RunHTMLWidgetRenderer=n}(e.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML||(e.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML={}))}(e.visual||(e.visual={}))}(e.extensibility||(e.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(e){!function(e){!function(e){!function(e){function t(e,t,a,s){if(e){var i=e[t];if(i){var n=i[a];if(void 0!==n)return n}}return s}function a(e,t,a,s,i,n){if(e){var r=e[t];if(r){var o=r[a];if(o<i)return i;if(o>n)return n;if(void 0!==o)return o}}return s}function s(e,t,a,s,i,n){if(e){var r=e[t];if(r){var o=r[a];if(void 0!==o)return o>n?n:o<i?i:o}}return s}function i(e,t,a,s,i,n){return n&&t==a&&1==i?s:n&&t!=a&&0==i?s:e}function n(e,t){return"auto"!=t?"None":"auto"==t&&"None"==e?"fast":e}function r(e,t,a){return e<t?t:e>a?a:e}function o(e,t,a,s,i){var n=e.objects;if(n){var r=n[t];if(r){var o=r[a];if(o){var p=o[s];if(void 0!==p)return p}}}return i}e.getValue=t,e.getValueMinMax=a,e.getValueNumberMinMax=s,e.ifStringReturnString=i,e.ifStringReturnStringClustersMethod=n,e.inMinMax=r,e.getCategoricalObjectValue=o}(e.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML||(e.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML={}))}(e.visual||(e.visual={}))}(e.extensibility||(e.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(e){!function(t){!function(t){!function(t){var a=[e.VisualUpdateType.Resize,e.VisualUpdateType.ResizeEnd,e.VisualUpdateType.Resize+e.VisualUpdateType.ResizeEnd],s=function(){function e(e){e&&e.element&&(this.rootElement=e.element),this.headNodes=[],this.bodyNodes=[],this.settings_forecastPlot_params={forecastLength:10,seasonType:"Automatic",errorType:"Automatic",trendType:"Automatic",dampingType:"Automatic",targetSeason:"Automatic"},this.settings_conf_params={show:!0,percentile:80,upperConfIntervalFactor:"0.5"},this.settings_graph_params={dataCol:"orange",forecastCol:"red",percentile:40,weight:10},this.settings_additional_params={showInfo:!0,textSize:10}}return e.prototype.update=function(e){if(e&&e.type&&e.viewport){var t=e.dataViews;if(t&&0!==t.length){var s=t[0];if(s&&s.metadata){this.updateObjects(s.metadata.objects);var i=null;s.scriptResult&&s.scriptResult.payloadBase64&&(i=s.scriptResult.payloadBase64),-1===a.indexOf(e.type)&&i&&this.injectCodeFromPayload(i),this.onResizing(e.viewport)}}}},e.prototype.onResizing=function(e){},e.prototype.injectCodeFromPayload=function(e){if(t.ResetInjector(),e){var a=document.createElement("html");try{a.innerHTML=window.atob(e)}catch(e){return}if(0===this.headNodes.length){for(;this.headNodes.length>0;){var s=this.headNodes.pop();document.head.removeChild(s)}var i=a.getElementsByTagName("head");if(i&&i.length>0){var n=i[0];this.headNodes=t.ParseElement(n,document.head)}}for(;this.bodyNodes.length>0;){var s=this.bodyNodes.pop();this.rootElement.removeChild(s)}var r=a.getElementsByTagName("body");if(r&&r.length>0){var o=r[0];this.bodyNodes=t.ParseElement(o,this.rootElement)}t.RunHTMLWidgetRenderer()}},e.prototype.updateObjects=function(e){this.settings_forecastPlot_params={forecastLength:t.getValue(e,"settings_forecastPlot_params","forecastLength",10),seasonType:t.getValue(e,"settings_forecastPlot_params","seasonType","Automatic"),errorType:t.getValue(e,"settings_forecastPlot_params","errorType","Automatic"),trendType:t.getValue(e,"settings_forecastPlot_params","trendType","Automatic"),dampingType:t.getValue(e,"settings_forecastPlot_params","dampingType","Automatic"),targetSeason:t.getValue(e,"settings_forecastPlot_params","targetSeason","Automatic")},this.settings_conf_params={show:t.getValue(e,"settings_conf_params","show",!0),percentile:t.getValue(e,"settings_conf_params","percentile",80),upperConfIntervalFactor:t.getValue(e,"settings_conf_params","upperConfIntervalFactor","0.5")},this.settings_graph_params={dataCol:t.getValue(e,"settings_graph_params","dataCol","orange"),forecastCol:t.getValue(e,"settings_graph_params","forecastCol","red"),percentile:t.getValue(e,"settings_graph_params","percentile",40),weight:t.getValue(e,"settings_graph_params","weight",10)},this.settings_additional_params={showInfo:t.getValue(e,"settings_additional_params","showInfo",!0),textSize:t.getValue(e,"settings_additional_params","textSize",10)}},e.prototype.enumerateObjectInstances=function(e){var a=e.objectName,s=[];switch(a){case"settings_forecastPlot_params":"None"!=this.settings_forecastPlot_params.trendType?s.push({objectName:a,properties:{forecastLength:Math.round(t.inMinMax(this.settings_forecastPlot_params.forecastLength,1,12e3)),trendType:this.settings_forecastPlot_params.trendType,dampingType:this.settings_forecastPlot_params.dampingType,errorType:this.settings_forecastPlot_params.errorType,seasonType:this.settings_forecastPlot_params.seasonType,targetSeason:this.settings_forecastPlot_params.targetSeason},selector:null}):s.push({objectName:a,properties:{forecastLength:Math.round(t.inMinMax(this.settings_forecastPlot_params.forecastLength,1,1e5)),trendType:this.settings_forecastPlot_params.trendType,errorType:this.settings_forecastPlot_params.errorType,seasonType:this.settings_forecastPlot_params.seasonType},selector:null});break;case"settings_conf_params":s.push({objectName:a,properties:{show:this.settings_conf_params.show,percentile:t.inMinMax(this.settings_conf_params.percentile,0,99),upperConfIntervalFactor:this.settings_conf_params.upperConfIntervalFactor},selector:null});break;case"settings_graph_params":s.push({objectName:a,properties:{dataCol:this.settings_graph_params.dataCol,forecastCol:this.settings_graph_params.forecastCol,percentile:this.settings_graph_params.percentile,weight:t.inMinMax(this.settings_graph_params.weight,1,50)},selector:null});break;case"settings_additional_params":1==this.settings_additional_params.showInfo?s.push({objectName:a,properties:{showInfo:this.settings_additional_params.showInfo,textSize:this.settings_additional_params.textSize},selector:null}):s.push({objectName:a,properties:{showInfo:this.settings_additional_params.showInfo},selector:null})}return s},e}();t.Visual=s}(t.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML||(t.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML={}))}(t.visual||(t.visual={}))}(e.extensibility||(e.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(e){!function(t){!function(t){t.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML={name:"PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML",displayName:"Forecasting",class:"Visual",version:"1.0.3",apiVersion:"1.4.0",create:function(t){return new e.extensibility.visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML.Visual(t)},custom:!0}}(t.plugins||(t.plugins={}))}(e.visuals||(e.visuals={}))}(powerbi||(powerbi={}));
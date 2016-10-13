# Copyright (c) Microsoft Corporation.  All rights reserved.

# Third Party Programs. This software enables you to obtain software applications from other sources. 
# Those applications are offered and distributed by third parties under their own license terms.
# Microsoft is not developing, distributing or licensing those applications to you, but instead, 
# as a convenience, enables you to use this software to obtain those applications directly from 
# the application providers.
# By using the software, you acknowledge and agree that you are obtaining the applications directly
# from the third party providers and under separate license terms, and that it is your responsibility to locate, 
# understand and comply with those license terms.
# Microsoft grants you no license rights for third-party software or applications that is obtained using this software.


##PBI_R_VISUAL: VIZGAL_FORECAST_ETS   Visualization of forecast using ETS
# Computes and visualizes a forecast of a time series
# Model type (within ETS framework) and all parameters are controlled by the user
# INPUT: 
# The input dataset should include exactly two numerical non-constant columns for X and Y  
#
# EXAMPLES:
#  #for R environment
# dat=BJsales.lead
# BJsaleData=data.frame(ind=index(dat),date=as.Date(dat),value=melt(dat)$value)
# dataset=data.frame(x=BJsaleData$ind,y=BJsaleData$value)
#  source("visGal_forecast_ets.R") #create graphics
#
# WARNINGS:  
#
# CREATION DATE: 24/7/2016
#
# LAST UPDATE: 26/7/2017
#
# VERSION: 0.0.2
#
# R VERSION TESTED: 3.2.2
# 
# AUTHOR: Jacob Minsky (t-jacobm@microsoft.com)
#
# REFERENCES: https://stat.ethz.ch/R-manual/R-devel/library/stats/html/loess.html


#PBI_EXAMPLE_DATASET for debugging purposes 

Sys.setlocale("LC_ALL","English")

#save(list=ls(all.names=TRUE), file="c:/users/t-jacobm/Documents/cvis.rdata")
#save(list = ls(all.names = TRUE), file='C:/Users/boefraty/projects/PBI/R/R_visuals_gallery/tempData.Rda')



if(exists("Date") && exists("Value"))
{
  dataset=data.frame(Time=as.Date(Date[,1]),Value=as.numeric(Value[,1]))
}else{
  dataset=data.frame()
  timeSeries = NULL
}

############ User Parameters #########

if(exists("settings_forecastPlot_params_show") && settings_forecastPlot_params_show == FALSE)
  rm(list= ls(pattern = "settings_forecastPlot_params_"))
# if(exists("settings_conf_params_show") && settings_conf_params_show == FALSE)
#   rm(list= ls(pattern = "settings_conf_params_"))
if(exists("settings_graph_params_show") && settings_graph_params_show == FALSE)
  rm(list= ls(pattern = "settings_graph_params_"))
if(exists("settings_additional_params_show") && settings_additional_params_show == FALSE)
  rm(list= ls(pattern = "settings_additional_params_"))


##PBI_PARAM: Should warnings text be displayed?
#Type:logical, Default:TRUE, Range:NA, PossibleValues:NA, Remarks: NA
showWarnings=FALSE
if(exists("settings_additional_params_showWarnings"))
  showWarnings = settings_additional_params_showWarnings

##PBI_PARAM: Should additional info about the forcasting method be displayed?
#Type:logical, Default:TRUE, Range:NA, PossibleValues:NA, Remarks: NA
showInfo=TRUE
if(exists("settings_additional_params_showInfo"))
  showInfo = settings_additional_params_showInfo

##PBI_PARAM: Forecast length
#Type:integer, Default:NULL, Range:NA, PossibleValues:NA, Remarks: NULL means choose forecast length automatically
forecastLength=10
if(exists("settings_forecastPlot_params_forecastLength"))
{
  forecastLength = as.numeric(settings_forecastPlot_params_forecastLength)
  if(is.na(forecastLength))
    forecastLength = 10
  forecastLength = round(max(min(forecastLength,1e+6),1))
}

##PBI_PARAM Error type
#Type: string, Default:"Automatic", Range:NA, PossibleValues:"Automatic","Multiplicative","Additive"
errorType = "Automatic"
if(exists("settings_forecastPlot_params_errorType"))
  errorType = settings_forecastPlot_params_errorType

##PBI_PARAM Trend type
#Type: string, Default:"Automatic", Range:NA, PossibleValues:"Automatic","Multiplicative","Additive","None"
trendType = "Automatic"
if(exists("settings_forecastPlot_params_trendType"))
  trendType = settings_forecastPlot_params_trendType

##PBI_PARAM Season type
#Type: string, Default:"Automatic", Range:NA, PossibleValues:"Automatic","Multiplicative","Additive","None"
seasonType = "Automatic"
if(exists("settings_forecastPlot_params_seasonType"))
  seasonType = settings_forecastPlot_params_seasonType

##PBI_PARAM Confidence level band display
#Type:logical, Default:TRUE, Range:NA, PossibleValues:NA, Remarks: NA
drawConfidenceLevels = TRUE
if(exists("settings_conf_params_show"))
  drawConfidenceLevels = settings_conf_params_show


lowerConfInterval = 0.8
if (exists("settings_conf_params_percentile")) 
{ 
  lowerConfInterval = as.numeric(settings_conf_params_percentile)/100
  if(is.na(lowerConfInterval))
    lowerConfInterval = 0.8
  
  lowerConfInterval = max(min(lowerConfInterval,0.99),0)
}
upperConfInterval = 0.98
if (exists("settings_conf_params_upperConfIntervalFactor")) 
{ upperConfInterval = lowerConfInterval+(1-lowerConfInterval)*as.numeric(settings_conf_params_upperConfIntervalFactor)}

if(drawConfidenceLevels==FALSE)
  lowerConfInterval=upperConfInterval=0

################## Parameters set by Custom Visual ##################################
# if (exists("settings_errorType")) { errorType = settings_errorType}
# if (exists("settings_trendType")) { trendType = settings_trendType}
# if (exists("settings_seasonType")) { seasonType = settings_seasonType}
# if (exists("settings_forecastLength")) { forecastLength = settings_forecastLength}
# 
# if (exists("settings_lowerConfInterval")) { lowerConfInterval = settings_lowerConfInterval}
# if (exists("settings_upperConfInterval")) { upperConfInterval = settings_upperConfInterval}



#####################################################################################


###############Library Declarations###############


libraryRequireInstall = function(packageName, ...)
{
  if(!require(packageName, character.only = TRUE)) 
    warning(paste("*** The package: '", packageName, "' was not installed ***",sep=""))
}

#ets
libraryRequireInstall("graphics")
libraryRequireInstall("scales")
libraryRequireInstall("forecast")
libraryRequireInstall("zoo")

###############Internal parameters definitions#################
#PBI_PARAM Minimal number of points
#Type:integer, Default:5, Range:[0,], PossibleValues:NA, Remarks: NA
minPoints = 5

##PBI_PARAM Color of time series line
#Type:string, Default:"orange", Range:NA, PossibleValues:"orange","blue","green","black"
pointsCol = "orange"
if(exists("settings_graph_params_dataCol"))
  pointsCol = settings_graph_params_dataCol

##PBI_PARAM Color of forecast line
#Type:string, Default:"red", Range:NA, PossibleValues:"red","blue","green","black"
forecastCol = "red"
if(exists("settings_graph_params_forecastCol"))
  forecastCol = settings_graph_params_forecastCol

#PBI_PARAM Transparency of scatterplot points
#Type:numeric, Default:0.4, Range:[0,1], PossibleValues:NA, Remarks: NA
transparency = 1
if(exists("settings_graph_params_percentile"))
  transparency = as.numeric(settings_graph_params_percentile)/100

#PBI_PARAM Shaded band for confidence interval
#Type:logical, Default:TRUE, Range:NA, PossibleValues:NA, Remarks: NA
fillConfidenceLevels=TRUE

#PBI_PARAM damping
#Type:logical, Default: NULL, Remarks: NULL selects damped or undamped trend depending on which fits better
damped = NULL
if(exists("settings_forecastPlot_params_dampingType"))
{
  damped = as.logical(settings_forecastPlot_params_dampingType)
  if(is.na(damped))
    damped=NULL
}

#PBI_PARAM Size of points on the plot
#Type:numeric, Default: 1 , Range:[0.1,5], PossibleValues:NA, Remarks: NA
pointCex = 1
if(exists("settings_graph_params_weight"))
  pointCex = as.numeric(settings_graph_params_weight)/10

#PBI_PARAM Size of subtitle on the plot
#Type:numeric, Default: 0.5 , Range:[0.1,5], PossibleValues:NA, Remarks: NA
cexSub = 0.75
if(exists("settings_additional_params_textSize"))
  cexSub = as.numeric(settings_additional_params_textSize)/12

###############Internal functions definitions#################

#if (exists("settings_showConf")) { fillConfidenceLevels = settings_showConf}


###############Upfront input correctness validations (where possible)#################

pbiWarning = NULL

N=nrow(dataset)

labTime = "Time"
labValue=names(dataset)[ncol(dataset)]

if (ncol(dataset) ==5) {
  
  dataset = dataset[,!colnames(dataset) %in% "Quarter"]
  colnames(dataset) <- c("Year","Month","Day","Value")
  dataset$PosixDate = as.POSIXct(paste(dataset$Year, dataset$Month, rep(1,nrow(dataset)), sep = "." ), 
                                 format="%Y.%B.%d", tz="UTC")
  dataset = dataset[order(dataset$PosixDate),]
  
  start=c(dataset$Year[1],dataset$Month[1],dataset$Day[1])
  end=c(dataset$Year[N],dataset$Month[N],dataset$Day[N])
  frequency = 365.25*N/as.numeric(dataset$PosixDate[N]-dataset$PosixDate[1])
  
  timeSeries=ts(start=start,end=end,frequency = round(frequency),
                data=dataset$Value)
  
} else if (ncol(dataset) == 2) {
  labTime = names(dataset)[1]
  colnames(dataset) <- c("Time","Value")
  dataset = dataset[order(dataset$Time),]
  frequency = round(N*365.25/as.numeric(dataset$Time[N]-dataset$Time[1]))
  
  start=dataset$Time[1]
  day <- as.numeric(strftime(start, format = "%d"))
  month <- as.numeric(strftime(start, format = "%m"))
  year <- as.numeric(strftime(start, format = "%Y"))
  
  
  timeSeries=ts(start = c(year, month, day),
                            frequency = frequency,
                            data = dataset$Value)
} else if (ncol(dataset) == 1) {
  timeSeries=as.ts(as.vector(dataset))
} else {
  pbiWarning = "Incorrect number of variables in dataset."
}

dataset<-dataset[complete.cases(dataset),] #remove corrupted rows

##############Main Visualization script###########

pbiInfo = NULL

if(length(timeSeries)>=minPoints) {
  
  ets_params = list(Automatic="Z",Multiplicative="M",Additive="A",None="N")
  deModel = paste(ets_params[[errorType]],ets_params[[trendType]],ets_params[[seasonType]],sep="")
  
  if(sum(deModel==c("ANM","ZMA","MMA","AZM","AMZ","AMM","AMA","AMN","AAM")))# Forbidden model combination 
    deModel = "ZZZ"
  
  fit = ets(timeSeries, model=deModel,damped=damped)
  if (is.null(forecastLength))
    prediction = forecast(fit, level=c(lowerConfInterval,upperConfInterval))
  else
    prediction = forecast(fit, level=c(lowerConfInterval,upperConfInterval), h=forecastLength)
  
  lastValue = tail(prediction$x,1)
  
  prediction$mean=ts(c(lastValue,prediction$mean), 
                     frequency = frequency(prediction$mean), 
                     end=end(prediction$mean))
  
  prediction$upper=ts(rbind(c(lastValue,lastValue),prediction$upper), 
                      frequency = frequency(prediction$upper), 
                      end=end(prediction$upper))
  
  prediction$lower=ts(rbind(c(lastValue,lastValue),prediction$lower), 
                      frequency = frequency(prediction$lower), 
                      end=end(prediction$lower))
  
  plot(prediction, lwd=pointCex, col=alpha(pointsCol,transparency), fcol=alpha(forecastCol,transparency), flwd = pointCex,shaded=fillConfidenceLevels)
  if(showInfo)
    pbiInfo=paste(pbiInfo,"Forecasts from ", fit$method, sep="")
  
  plot(prediction, lwd=pointCex, col=alpha(pointsCol,transparency), fcol=alpha(forecastCol,transparency), flwd = pointCex, shaded=fillConfidenceLevels, 
       main = "", sub = pbiInfo, col.sub = "gray50",cex.sub=cexSub, xlab = labTime, ylab = labValue)
  
  
} else{ #empty plot
  plot.new()
  pbiWarning<-paste(pbiWarning, "Not enough data points", sep="\n")
}

#add warning as subtitle
if(showWarnings)
  title(main=NULL, sub=pbiWarning,outer=FALSE, col.sub = "gray50", cex.sub=cexSub)


remove("dataset")
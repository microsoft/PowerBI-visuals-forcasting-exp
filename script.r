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

#
# WARNINGS:   
#
# CREATION DATE: 24/7/2016
#
# LAST UPDATE: 30/11/2016
#
# VERSION: 0.0.3
#
# R VERSION TESTED: 3.2.2
# 
# AUTHOR: pbicvsupport@microsoft.com
#
# REFERENCES: http://www.exponentialsmoothing.net/



Sys.setlocale("LC_ALL","English")


############ User Parameters #########


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


##PBI_PARAM target Season
#Type: string, Default:"Automatic", Range:NA, PossibleValues:"Automatic","Hour","Day","Week", ...
targetSeason = "Automatic"
if(exists("settings_forecastPlot_params_targetSeason"))
  targetSeason = settings_forecastPlot_params_targetSeason



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
#Type:integer, Default:7, Range:[0,], PossibleValues:NA, Remarks: NA
minPoints = 7

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
#Type:numeric, Default: 0.75 , Range:[0.1,5], PossibleValues:NA, Remarks: NA
cexSub = 0.75
if(exists("settings_additional_params_textSize"))
  cexSub = as.numeric(settings_additional_params_textSize)/12

###############Internal functions definitions#################

# tiny function to deal with verl long strings on plot
cutStr2Show = function(strText, strCex = 0.8, abbrTo = 100, isH = TRUE, maxChar = 3, partAvailable = 1)
{
  # partAvailable, wich portion of window is available, in [0,1]
  if(is.null(strText))
    return (NULL)
  
  SCL = 0.075*strCex/0.8
  pardin = par()$din
  gStand = partAvailable*(isH*pardin[1]+(1-isH)*pardin[2]) /SCL
  
  # if very very long abbreviate
  if(nchar(strText)>abbrTo && nchar(strText)> 1)
    strText = abbreviate(strText, abbrTo)
  
  # if looooooong convert to lo...
  if(nchar(strText)>round(gStand) && nchar(strText)> 1)
    strText = paste(substring(strText,1,floor(gStand)),"...",sep="")
  
  # if shorter than maxChar remove 
  if(gStand<=maxChar)
    strText = NULL
  
  return(strText) 
}


# verify if "perSeason" is good for "frequency" parameter
freqSeason = function(seasons,perSeason)
{
  if((seasons > 5 && perSeason > 3) || (seasons>2 && perSeason > 7))
    return (perSeason)
  
  return(1)
}

# find frequency using the dates, targetS is a "recommended" seasonality 
findFreq = function(dates, targetS = "Automatic")
{
  freq = 1
  N = length(dates)
  nnn = c("Minute","Hour", "Day", "Week", "Month", "Quater", "Year")
  seasons = rep(NaN,7)
  names(seasons) = nnn
  perSeason = seasons
  
  seasons["Day"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="days"))
  seasons["Hour"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="hours"))
  seasons["Minute"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="mins"))
  seasons["Week"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="weeks"))
  seasons["Month"] = seasons["Day"]/30
  seasons["Year"] = seasons["Day"]/365.25
  seasons["Quater"] = seasons["Year"]*4
  
  perSeason = N/seasons
  
  if(targetS!="Automatic") # target 
    freq = perSeason[targetS]
  
  if(freq < 2 || round(freq)>24) # if TRUE, target season factor is not good 
    freq = 1
  
  for( s in rev(nnn)) # check year --> Quater --> etc
    if(freq==1 || round(freq)>24)
      freq = freqSeason(seasons[s],perSeason[s])
     
  
  if(round(freq)>24) # limit of exp smoothing R implementation
    freq = 1
  
  return(freq)
}

# Find number of ticks on X axis 
FindTicksNum = function(n,f)
{
  tn = 10 # default minimum
  D = 2 # tick/inch
  numCircles = n/f
  xSize = par()$din[1]
  tn = max(round(xSize*D),tn)
  return(tn) 
}

#format labels on X-axis automatically 
flexFormat = function(dates, orig_dates, freq = 1, myformat = NULL)
{
  
  days=(as.numeric(difftime(dates[length(dates)],dates[1]),units="days"))
  months = days/30
  years = days/365.25
  
  
  constHour = length(unique(orig_dates$hour))==1
  constMin = length(unique(orig_dates$min))==1
  constSec = length(unique(orig_dates$sec))==1
  constMon = length(unique(orig_dates$mon))==1
 
  timeChange = any(!constHour,!constMin,!constSec)
  
  if(is.null(myformat))
  {
    if(years > 10){
      if(constMon)
      {
        myformat = "%Y" #many years => only year :2001
      }else{
        myformat = "%m/%y" #many years + months :12/01
      }
    }else{
      if(years > 1 && N < 50){
        myformat = "%b %d, %Y" #several years, few samples:Jan 01, 2010
      }else{
        if(years > 1){
          myformat = "%m/%d/%y" #several years, many samples: 01/20/10
        }else{
          if(years <= 1 && !timeChange)
            myformat = "%b %d" #1 year,no time: Jan 01
        }  
      }
    }
  }
  if(is.null(myformat) && timeChange)
    if(years>1){
      myformat = "%m/%d/%y %H:%M" # 01/20/10 12:00
    }else{
      if(days>1){
        myformat = "%b %d, %H:%M" # Jan 01 12:00
      }else{
        if(days<=1){
          myformat = "%H:%M" # Jan 01 12:00
        }  
      }
    }
  if(!is.null(myformat)){
    if(myformat == "%Y,Q%q")
      dates = as.yearqtr(dates)
    dates1= format(dates,  myformat)
  }else{
    dates1 = as.character(1:length(dates)) # just id 
  }
  return(dates1)
}


###############Upfront input correctness validations (where possible)#################
pbiWarning = NULL

if(exists("Date") && exists("Value"))
{
  dataset=tryCatch({
    cbind(Date,Value)
  },
  error=function(e) {
    return(data.frame())
  }
  )
}else{
  dataset=data.frame()
  pbiWarning  = cutStr2Show("Both 'Date' and 'Value' fields are required.", strCex = 0.85)
  timeSeries=ts()
  showWarnings=TRUE
}

dataset<-dataset[complete.cases(dataset),] #remove corrupted rows

N=nrow(dataset)

labTime = "Time"
labValue=names(dataset)[ncol(dataset)]

if(N==0 && exists("Date") && nrow(Date)>0 &&  exists("Value")){
  pbiWarning1  = cutStr2Show("Wrong date type. Only 'Date', 'Time', 'Date/Time' are allowed without hierarchy", strCex = 0.85)
  pbiWarning = paste(pbiWarning1, pbiWarning, sep ="\n")
  timeSeries=ts()
  showWarnings=TRUE
}else {
  
  result = tryCatch({
    parsed_dates=strptime(dataset[,1],"%Y-%m-%dT%H:%M:%S",tz="UTC")
    labTime = names(Date)[1]
    
    if((any(is.na(parsed_dates))))
    {
      pbiWarning1  = cutStr2Show("Wrong or corrupted 'Date'.", strCex = 0.85)
      pbiWarning2  = cutStr2Show("Only 'Date', 'Time', 'Date/Time' types are allowed without hierarchy", strCex = 0.85)
      pbiWarning = paste(pbiWarning1, pbiWarning2, pbiWarning, sep ="\n")
      timeSeries=ts()
      showWarnings=TRUE
      error()
    }
    
    interval = difftime(parsed_dates[length(parsed_dates)],parsed_dates[1])/(length(parsed_dates)-1) # force equal spacing 
    x = as.POSIXlt(seq(from=parsed_dates[1], by=interval, length.out=length(parsed_dates)))
    
    myFreq = findFreq(parsed_dates, targetS = targetSeason)
    
    timeSeries=ts(data = dataset[,2], start=1, frequency = round(myFreq))
  
  }, 
  warning = function(w) {}, 
  error = function(e) {
    pbiWarning = "Wrong dimensionality of dataset."
    timeSeries=ts()
    showWarnings=TRUE
    return(timeSeries)
  }
  )
}

##############Main Visualization script###########

pbiInfo = NULL

if(length(timeSeries)>=minPoints) {
  
  ets_params = list(Automatic="Z",Multiplicative="M",Additive="A",None="N")
  if(frequency(timeSeries) == 1)
    seasonType = "None"
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
  
  if(showInfo)
    pbiInfo=paste(pbiInfo,"Forecasts from ", fit$method, sep="")
  
  
  labTime = cutStr2Show(labTime, strCex =1.1, isH = TRUE)
  labValue = cutStr2Show(labValue, strCex =1.1, isH = FALSE)
  
  plot.forecast(prediction, lwd=pointCex, col=alpha(pointsCol,transparency), fcol=alpha(forecastCol,transparency), flwd = pointCex, shaded=fillConfidenceLevels, 
                main = "", sub = pbiInfo, col.sub = "gray50", cex.sub = cexSub, xlab = labTime, ylab = labValue, xaxt = "n")
  
  
  NpF = (length(parsed_dates))+forecastLength
  freq = frequency(timeSeries)
  
  #format  x_with_f
  numTicks = FindTicksNum(NpF,freq) # find based on plot size
  
  x_with_f = as.POSIXlt(seq(from=parsed_dates[1], to = (parsed_dates[1]+interval*(length(parsed_dates)+forecastLength)), length.out = numTicks))
  x_with_forcast_formatted = flexFormat(dates = x_with_f, orig_dates = parsed_dates, freq = freq)
  
  correction = (NpF-1)/(numTicks-1) # needed due to subsampling of ticks
  axis(1, at = 1+correction*((0:(numTicks-1))/freq), labels = x_with_forcast_formatted)
  
  
} else{ #empty plot
  plot.new()
  showWarnings = TRUE
  pbiWarning<-paste(pbiWarning, "Not enough data points", sep="\n")
}

#add warning as subtitle
if(showWarnings)
  title(main=NULL, sub=pbiWarning,outer=FALSE, col.sub = "gray50", cex.sub=cexSub)

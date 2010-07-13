/////////////////////////////
// all times in seconds
var POLLER_INTERVAL = 24;
var REQUEST_TIMEOUT = 8;
/////////////////////////////

function MonitorPortFactory(elementName, extra) {
  	var monitor = new Element(elementName);
	monitor.errorCount = 0;
	monitor.lastState = "ok";
	
	if(localStorage[extra.name] != undefined) {	
		monitor.previousResults = localStorage[extra.name].evalJSON();
	} else {
		localStorage.clear();
		monitor.previousResults = new Array();
		for( var p=0; p<=32; p++){ 
			monitor.previousResults.push("unknown");
		}
/* 		localStorage[extra.name] = monitor.previousResults; */
	}
	
	monitor.setMessage = function(newMessage){
		monitor.select("span.message")[0].update(newMessage);
	}
	
	monitor.setStatus = function(newStatus){
		switch(newStatus){
			case "ok":
			case "warn":
			case "fail":
				break;
			default:
				newStatus = "unknown";
		}
	    monitor.className = "monitor " + newStatus;
		monitor.previousResults.shift();
		monitor.previousResults.push(newStatus);
		localStorage[extra.name] = monitor.previousResults.toJSON();
/* 		console.debug(monitor.previousResults); */
	    return newStatus;
	};
	
	monitor.pushStatus = function(resp){
		if(resp.status == 200)
		{
			if(monitor.lastState != "fail") /* (monitor.errorCount < 1) */
			{
				monitor.setStatus("ok");
			}
			else
			{
				monitor.setStatus("warn");
				monitor.errorCount =- 1;
			}

			monitor.lastState = "ok";
		}
		else/*  if(resp.status >= 500) */
		{
			epicFail(resp.request, new String("#{url} returned with non-200 status.").interpolate(extra));
			monitor.lastState = monitor.setStatus("fail");
			monitor.errorCount =+ 1;
		}
		
	  	monitor.sparkline.redraw(monitor.previousResults);
 	};
	
 	monitor.setStatus("unknown");
	monitor.identify();
	
	var hiddenIframe = new Element("iframe");
	hiddenIframe.identify();
	hiddenIframe.hide();

	var sparklineCanvas = new Element("span", {"class":"sparklineCanvas"});
	monitor.sparkline = PanelFactory(sparklineCanvas, monitor.previousResults);
	monitor.appendChild(sparklineCanvas);
	
	monitor.appendChild(hiddenIframe);

	monitor.appendChild(Element("span").addClassName("questionmark").update("?"));
	monitor.appendChild(Element("span").addClassName("message"));

  	monitor.setMessage(extra.name);

    return monitor;
}


function PanelFactory(canvasId, dataset){
	var sparkWidth = 2;
	var sparkSpacing = 1;
	window.console && console.debug("PanelFactory initial dataset: " +dataset);
	
	var w = 2+(sparkWidth * dataset.length) + (sparkSpacing * (dataset.length-1));
	var h = 16;
	window.console && console.log(dataset[1]);
	$(canvasId).panel = new pv.Panel().canvas(canvasId)
	  .width(w)
	  .height(h)
	.add(pv.Rule)
	  .bottom(h / 2 - .5)
	  .lineWidth(.5)
	.add(pv.Bar)
	  .data(pv.range(dataset.length).map(function(m) {return (dataset[m] == "ok" ? 1: 0)} ))
	  .width(sparkWidth)
	  .left(function() {return 1+(sparkWidth * this.index) + (sparkSpacing * this.index)} )
	  .bottom(function(d) {return d ? h / 2 : 0} )
	  .height(h / 2)
 	  .fillStyle(function(d) {return (d == 0 ? "#dd0000" : d == 1 ? "#74e674" : null )});
/*  	  .fillStyle(function(d) {return (d < 1 ? "#dd0000" : "#74e674" )}); */

	$(canvasId).panel.redraw = function(newData){
/* 		console.debug(newData); */
		this.data(pv.range(newData.length).map(function(m) {return (newData[m] == "fail" ? 0: newData[m] == "unknown" ? .5: 1)} ));
		this.root.render();
	};
	
	return $(canvasId).panel;
}

function initializePoller(transport)
{
	var jsonResult = transport.responseText.evalJSON();

	/* foreach group */
	jsonResult.monitorGroups.each(function(monitorGroup){
		var groupCanvas = new Element("div").addClassName("groupCanvas");
		document.body.appendChild(groupCanvas);
		
		var header = new Element("h1").addClassName("groupName").update(monitorGroup.groupName);
		groupCanvas.appendChild(header);

		/* draw monitors */
		monitorGroup.monitoringUrls.each(function(monitoringPoint){
			var monitorPort = MonitorPortFactory("div", monitoringPoint);
			monitorPort.setMessage(monitoringPoint.name);
			groupCanvas.appendChild(monitorPort);
			monitorPort.wrap("a", {"href": monitoringPoint.url, "target": "_blank", "title": monitoringPoint.url}); /* element needs to be attached before it can be wrapped ... */

			new MonitorUpdater(monitorPort, monitoringPoint.url);
			
		});

	});

}

function epicFail(req,e)
{
	if(e instanceof SyntaxError){
		window.console && console.error("Error while initializing monitoring points!\n("+e+")");
	}
	else
	{
		window.console && console.warn("Service failing: " + e);
	}
}

function callInProgress (xmlhttp) {
	switch (xmlhttp.readyState) {
	case 1:
	case 2:
	case 3:
		return true;
		break;
	// Case 4, 0, or any other bug induced states
	default:
		return false;
		break;
	}
}

var MonitorUpdater = Class.create(Ajax.PeriodicalUpdater, {
	initialize: function($super, resultsContainer, url){
 		return $super( $$("#" + resultsContainer.id + ">iframe")[0], 
 			url, {
 				"frequency": POLLER_INTERVAL, 
 				method: "get",
 				evalJS: false,
 				evalJSON: false, 
 				onException: resultsContainer.pushStatus,
  				onFailure: resultsContainer.pushStatus,
 				onSuccess: resultsContainer.pushStatus,
				onCreate: function(updater) {
					updater['timeoutId'] = window.setTimeout(
						function() {
							// If we have hit the timeout and the AJAX request is active, abort it
							if (callInProgress(updater.request.transport)) {
								updater.request.transport.abort();
								// onFailure has already been called at this stage...
								window.console && console.log(new String("#{url} request timed out.").interpolate(updater.request));
							}
							/* else console.info("It went well, ", updater.request.url); */
						},
						REQUEST_TIMEOUT * 1000 // needs milliseconds
					); //setTimeout..)
				},
				onComplete: function(request) {
					// XHR call completed before the timeout: good, so clear it.
					window.clearTimeout(request['timeoutId']);
				}
 			}
 		);
	}
});

var jr = new Ajax.Request('monitoringurls.json', {
	onSuccess: initializePoller,
	onException: epicFail,
	method:'get',
});

document.observe("dom:loaded", function() {
	// the fine print ;-)
	if(document.location.toString().indexOf("file")==-1){
		document.body.appendChild(
			new Element("h3").setStyle({"border":"0.8em solid orange","color":"#3e76d1","padding":"1em"}).update(
'Until either each application has its own little "application health status" page thing that can be loaded into an iframe, OR all servers start supplying Access-Control-Allow-Origin headers, this page will only work if used from a "file://" style URL (in Safari), sorry.'
		));
	}
});

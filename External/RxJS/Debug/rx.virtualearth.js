// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function()
{
    var veMap = VEMap;    
    var root;
    var global = this;
    if (typeof ProvideCustomRxRootObject == "undefined")
    {
        root = global.Rx;
    }
    else
    {
        root = ProvideCustomRxRootObject();
    }
    var observable = root.Observable;
    var observableCreate = observable.Create;
    var asyncSubject = root.AsyncSubject;

    veMap.prototype.ToObservable = function(eventName)
    {
        var parent = this;
        return observableCreate(function(observer)
        {
            var handler = function(eventObject)
            {
                observer.OnNext(eventObject);
            };
            parent.AttachEvent(eventName, handler);
            return function()
            {
                parent.DetachEvent(eventName, handler);
            };
        });
    };

    veMap.prototype.FindAsObservable = function(what, where, findType, shapeLayer, startIndex, numberOfResults, showResults, createResults, useDefaultDisambiguation, setBestMapView)
    {
	var subject = new asyncSubject();
        this.Find(what, where, findType, shapeLayer, startIndex, numberOfResults, showResults, createResults, useDefaultDisambiguation, setBestMapView, 
		function(shapeLayer, findResults, places, hasMoreResults, error)
	        {
                    if(error)
                    {
                        subject.OnError(error);
                    }
        	    else
                    {
                        subject.OnNext({ ShapeLayer: shapeLayer, FindResults : findResults, Places : places, HasMoreResults: hasMoreResults });
	                subject.OnCompleted();
                    }
	        });
        return subject;
    }

    veMap.prototype.FindLocationsAsObservable = function(veLatLong)
    {
	var subject = new asyncSubject();
        this.FindLocations(veLatLong, 
	    function(places)
	    {
                subject.OnNext(places);
                subject.OnCompleted();
	    });
        return subject;
    }


    veMap.prototype.GetDirectionsAsObservable = function(locations, options)
    {
	var newOptions = new VERouteOptions();
	for(var k in options)
	{
           newOptions[k] = options[k];
	}

	var subject = new asyncSubject();

        newOptions.RouteCallback = function(route)
        {
           subject.OnNext(route);
           subject.OnCompleted();
	};

        this.GetDirections(locations, newOptions);
        return subject;
    }

    veMap.prototype.ImportShapeLayerDataAsObservable = function(shapeSource, setBestView)
    {
	var subject = new asyncSubject();
        this.ImportShapeLayerData(shapeSource, 
	    function(shapeLayer)
	    {
                subject.OnNext(shapeLayer);
                subject.OnCompleted();
	    }, setBestView);
        return subject;
    }
})();
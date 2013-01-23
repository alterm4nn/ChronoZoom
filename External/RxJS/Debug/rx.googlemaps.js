// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function()
{
    var maps = google.maps;   
    var evt = maps.event; 
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

    evt.addListenerAsObservable = function(instance, eventName)
    {
        return observableCreate(function(observer)
        {
            var listener = evt.addListener(instance, eventName, function(eventObject)
            {
                observer.OnNext(eventObject);
            });            
            return function()
            {
                evt.removeListener(listener);
            };
        });
    };

    evt.addDomListenerAsObservable = function(instance, eventName)
    {
        return observableCreate(function(observer)
        {
            var listener = evt.addDomListener(instance, eventName, function(eventObject)
            {
                observer.OnNext(eventObject);
            });            
            return function()
            {
                evt.removeListener(listener);
            };
        });
    };

    maps.ElevationService.prototype.getElevationAlongPathAsObservable = function(request)
    {
	var subject = new asyncSubject();
        this.getElevationAlongPath(request, 
	    function(elevationResults, elevationStatus)
	    {
		if (elevationStatus != maps.ElevationStatus.OK)
		{
			subject.OnError(elevationStatus);
		}
		else
		{
                	subject.OnNext(elevationResults);
	                subject.OnCompleted();
		}
	    });
        return subject;
    };

    maps.ElevationService.prototype.getElevationForLocationsAsObservable = function(request)
    {
	var subject = new asyncSubject();
        this.getElevationForLocations(request, 
	    function(elevationResults, elevationStatus)
	    {
                if (elevationStatus != maps.ElevationStatus.OK)
		{
			subject.OnError(elevationStatus);
		}
		else
		{
                	subject.OnNext(elevationResults);
	                subject.OnCompleted();
		}
	    });
        return subject;
    };

    maps.Geocoder.prototype.geocodeAsObservable = function(request)
    {
	var subject = new asyncSubject();
        this.geocode(request, 
	    function(geocoderResults, geocoderStatus)
	    {
                if (geocoderStatus != maps.GeocoderStatus.OK)
		{
			subject.OnError(geocoderStatus);
		}
		else
		{
                	subject.OnNext(geocoderResults);
	                subject.OnCompleted();
		}
	    });
        return subject;
    };

    maps.DirectionsService.prototype.routeAsObservable = function(request)
    {
	var subject = new asyncSubject();
        this.route(request, 
	    function(directionsResults, directionsStatus)
	    {
                if (directionsStatus != maps.DirectionsStatus.OK)
		{
			subject.OnError(directionsStatus);
		}
		else
		{
                	subject.OnNext(directionsResults);
	                subject.OnCompleted();
		}
	    });
        return subject;
    };

    maps.StreetViewService.prototype.getPanoramaById = function(pano)
    {
	var subject = new asyncSubject();
        this.getPanoramaById(pano, 
	    function(data, status)
	    {
                if (status != maps.StreetViewStatus.OK)
		{
			subject.OnError(status);
		}
		else
		{
                	subject.OnNext(data);
	                subject.OnCompleted();
		}
	    });
        return subject;
    };

    maps.StreetViewService.prototype.getPanoramaByLocation = function(latlng, radius)
    {
	var subject = new asyncSubject();
        this.getPanoramaByByLocation(latlng, radius,
	    function(data, status)
	    {
                if (status != maps.StreetViewStatus.OK)
		{
			subject.OnError(status);
		}
		else
		{
                	subject.OnNext(data);
	                subject.OnCompleted();
		}
	    });
        return subject;
    };


    maps.MVCArray.prototype.ToObservable = function(scheduler)
    {
	if (scheduler === _undefined) scheduler = currentThreadScheduler;
	var parent = this;

        return observableCreateWithDisposable(function(subscriber)
        {
            var count = 0;
            return scheduler.ScheduleRecursive(function(self)
            {
                if (count < parent.getLength())
                {
                    subscriber.OnNext(parent.getAt(count));
                    self();
                }
                else
                {
                    subscriber.OnCompleted();
                }
            });
        }); 
     }
})();
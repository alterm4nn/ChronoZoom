// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function()
{
    var root;
    if (typeof ProvideCustomRxRootObject == "undefined")
    {
        root = this.Rx;
    }
    else
    {
        root = ProvideCustomRxRootObject();
    }
    var observable = root.Observable;

    var fromPrototypeEvent = function(prototypeElement, eventType)
    {
        return observable.Create(function(observer)
        {
            var handler = function(eventObject)
            {
                observer.OnNext(eventObject);
            };
            Element.observe(prototypeElement, eventType, handler);
            return function()
            {
                Element.stopObserving(prototypeElement, eventType, handler);
            };
        });
    };

    Element.addMethods({ toObservable: function(element, eventType) { return fromPrototypeEvent(element, eventType); } });

    Ajax.observableRequest = function(url, options)
    {
        var newOptions = {};
        for (var k in options)
        {
            newOptions[k] = options[k];
        }
        var subject = new root.AsyncSubject();
        newOptions.onSuccess = function(response)
        {
            subject.OnNext(response);
            subject.OnCompleted();
        };

        newOptions.onFailure = function(response)
        {
            subject.OnError(response);
        };
        var request = new Ajax.Request(url, newOptions);
        return subject;
    }

    Enumerable.addMethods({ toObservable: function(scheduler)
    {
        if (scheduler === undefined)
            scheduler = root.Scheduler.Immediate;
        return observable.FromArray(this.toArray());
    }
    });
})();



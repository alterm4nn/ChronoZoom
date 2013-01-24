// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function()
{
    var global = this;
    var root;
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

    Raphael.el.toObservable = function(eventType)
    {
        var parent = this;
        return observableCreate(function(observer)
        {
            var handler = function(eventObject)
            {
                observer.OnNext(eventObject);
            };
            parent[eventType](handler);
            return function()
            {
                parent["un" + eventType](handler);
            };
        });
    };

    Raphael.el.hoverAsObservable = function(eventType)
    {
        var parent = this;
        return observableCreate(function(observer)
        {
            var handlerIn = function(e)
            {
                e = e || window.event;
                observer.OnNext({ hit: true, event: e });
            };

            var handlerOut = function(e)
            {
                e = e || window.event;
                observer.OnNext({ hit: false, event: e });
            };
            parent.hover(handlerIn, handlerOut);
            return function()
            {
                parent.unhover(handlerIn, handlerOut);
            };
        });
    };

})();
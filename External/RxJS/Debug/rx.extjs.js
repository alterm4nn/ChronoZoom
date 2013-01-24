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

    var ext = Ext;

    var fromExtJSEvent = function(extJSObject, eventName, scope, options)
    {
        return observable.Create(function(observer)
        {
            var em = ext.EventManager;
            var handler = function(eventObject)
            {
                observer.OnNext(eventObject);
            };
            em.on(extJSObject, eventName, handler, scope, options);
            return function()
            {
                em.un(extJSObject, eventName, handler, scope);
            };
        });
    };

    ext.Element.prototype.toObservable = function(eventName, scope, options)
    {
        return fromExtJSEvent(this, eventName, scope, options);
    };

    ext.util.Observable.prototype.toObservable = function(eventName, scope, options)
    {
        var parent = this;
        return observable.Create(function(observer)
        {
            var handler = function(eventObject)
            {                
                observer.OnNext(eventObject);
            };
            parent.on(eventName, handler, scope, options);
            return function()
            {
                parent.un(eventName, handler, scope);
            };
        });  
    };

    ext.Ajax.observableRequest = function(options)
    {
        var newOptions = {};
        for (var k in options)
        {
            newOptions[k] = options[k];
        }
        var subject = new root.AsyncSubject();
        newOptions.success = function(response, opts)
        {
            subject.OnNext({ response: response, options: opts });
            subject.OnCompleted();
        };
        newOptions.failure = function(response, opts)
        {
            subject.OnError({ response: response, options: opts });
        };
        ext.Ajax.request(newOptions);
        return subject;
    };
})();

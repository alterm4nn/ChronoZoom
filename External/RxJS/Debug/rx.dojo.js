// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function ()
{
    var fromDojoEvent = Rx.Observable.FromDojoEvent = function (dojoObject, eventType, context, dontFix)
    {
        return Rx.Observable.Create(function (observer)
        {
            var handler = function (eventObject)
            {
                observer.OnNext(eventObject);
            };
            var handle = dojo.connect(dojoObject, eventType, context, handler, dontFix);
            return function ()
            {
                dojo.disconnect(handle);
            };
        });
    };

    dojo.xhrGetAsObservable = function (options)
    {
        var newOptions = {};
        for (var k in options)
        {
            newOptions[k] = options[k];
        }

        var subject = new root.AsyncSubject();
        newOptions.load = function (data, ioArgs)
        {
            subject.OnNext({ data: data, ioArg: ioArgs });
            subject.OnCompleted();
        };

        newOptions.error = function (error, ioArgs)
        {
            subject.OnNext({ error: error, ioArg: ioArgs });
            subject.OnCompleted();
        };

        dojo.xhrGet(newOptions);
        return subject;
    };


    dojo.xhrPostAsObservable = function (options)
    {
        var newOptions = {};
        for (var k in options)
        {
            newOptions[k] = options[k];
        }

        var subject = new root.AsyncSubject();
        newOptions.load = function (data, ioArgs)
        {
            subject.OnNext({ data: data, ioArg: ioArgs });
            subject.OnCompleted();
        };

        newOptions.error = function (error, ioArgs)
        {
            subject.OnNext({ error: error, ioArg: ioArgs });
            subject.OnCompleted();
        };

        dojo.xhrPost(newOptions);
        return subject;
    };

    dojo.xhrPutAsObservable = function (options)
    {
        var newOptions = {};
        for (var k in options)
        {
            newOptions[k] = options[k];
        }

        var subject = new root.AsyncSubject();
        newOptions.load = function (data, ioArgs)
        {
            subject.OnNext({ data: data, ioArg: ioArgs });
            subject.OnCompleted();
        };

        newOptions.error = function (error, ioArgs)
        {
            subject.OnNext({ error: error, ioArg: ioArgs });
            subject.OnCompleted();
        };

        dojo.xhrPut(newOptions);
        return subject;
    };

    dojo.xhrDeleteAsObservable = function (options)
    {
        var newOptions = {};
        for (var k in options)
        {
            newOptions[k] = options[k];
        }

        var subject = new root.AsyncSubject();
        newOptions.load = function (data, ioArgs)
        {
            subject.OnNext({ data: data, ioArg: ioArgs });
            subject.OnCompleted();
        };

        newOptions.error = function (error, ioArgs)
        {
            subject.OnNext({ error: error, ioArg: ioArgs });
            subject.OnCompleted();
        };

        dojo.xhrDelete(newOptions);
        return subject;
    };

    dojo.Deferred.prototype.asObservable = function ()
    {
        var subject = new Rx.AsyncSubject();
        this.then(function (value)
        {
            subject.OnNext(value);
            subject.OnCompleted();
        },
        function (error)
        {
            subject.OnError(error);
        });
        return subject;
    };

    Rx.AsyncSubject.prototype.AsDeferred = function ()
    {
        var deferred = new dojo.Deferred();
        this.Subscribe(function (value)
        {
            deferred.callback(value);
        },
        function (error)
        {
            deferred.errback(error);
        });
        return deferred;
    }
})();



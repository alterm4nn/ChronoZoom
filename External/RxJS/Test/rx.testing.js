(function()
{

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
    var testRoot = root.Testing = {};

    var ppArray = function(v)
    {
        var sb = ['['];
        for (var i = 0; i < v.length; i++)
        {
            if (i > 0) sb.push(', ');
            sb.push(pp(v[i]));
        }
        sb.push(']');
        return sb.join("");
    }

    var ppObject = function(v)
    {
        var sb = ['{'];
        var first = true;
        for (var k in v)
        {
            if (first)
            {
                first = false;
            }
            else
            {
                sb.push(", ");
            }
            sb.push(k);
            sb.push(": ");
            sb.push(pp(v[k]));
        }
        sb.push('}');
        return sb.join("");
    }

    var ppString = function(v)
    {
        var sb = ['"'];
        for (var i = 0; i < v.length; i++)
        {
            switch (v.charAt(i))
            {
                case '\n': sb.push('\\n'); break;
                case '\t': sb.push('\\t'); break;
                case '\r': sb.push('\\r'); break;
                case '\f': sb.push('\\f'); break;
                case '\v': sb.push('\\v'); break;
                case '"': sb.push('\\"'); break;
                default: sb.push(v.charAt(i));
            }
        }
        sb.push('"');
        return sb.join("");
    }

    var ppFunction = function(v)
    {
        var sb = ['('];
        sb.push(v.toString());
        sb.push(')');
        return sb.join("");
    }

    var pp = testRoot.PrettyPrint = function(v)
    {
        if (v === undefined) return "undefined";
        if (v === null) return "null";
        if (typeof v == "string") return ppString(v);
        if (typeof v == "number") return v.toString();
        if (typeof v == "boolean") return v.toString();
        if (v instanceof Date) return "new Date(" + v.getTime() + ")";
        if (v instanceof Function) return ppFunction(v);
        if (v instanceof Error) return v.message;
        if (v instanceof Array) return ppArray(v);
        if (v instanceof Object) return ppObject(v);
        throw "unknown type: " + typeof v + ", for value: " + v;
    }

    var testScheduler = testRoot.TestScheduler = function(details)
    {
        var scheduler = new Rx.Scheduler(function(action)
        {
            var existing = this.items[this.currentTime];
            if (existing === undefined)
            {
                existing = [];
                this.items[this.currentTime] = existing;
            }
            var booleanDisposable = new Rx.BooleanDisposable();
            existing.push(function() { if (!booleanDisposable.GetIsDisposed()) action(); });
            this.maxTime = Math.max(this.currentTime, this.maxTime);
            return booleanDisposable;
        },
			function(action, dueTime)
			{
			    var finalTime = dueTime + this.currentTime;
			    var existing = this.items[finalTime];
			    if (existing === undefined)
			    {
			        existing = [];
			        this.items[finalTime] = existing;
			    }
			    var booleanDisposable = new Rx.BooleanDisposable();
			    existing.push(function() { if (!booleanDisposable.GetIsDisposed()) action(); });

			    this.maxTime = Math.max(finalTime, this.maxTime);
			    return booleanDisposable;
			}, function() { return scheduler.currentTime; });
        scheduler.currentTime = 0;
        scheduler.maxTime = 0;
        scheduler.items = {};
        scheduler.NextStep = function()
        {
            if (scheduler.currentTime <= scheduler.maxTime)
            {
                if (scheduler.items[scheduler.currentTime] !== undefined)
                {
                    var items = scheduler.items[scheduler.currentTime];
                    for (var i = 0; i < items.length; i++)
                    {
                        items[i]();
                    }
                }
                scheduler.currentTime++;
                if (details.tick)
                    details.tick(scheduler.currentTime);
            }
        };

        scheduler.Run = function(action)
        {
            var testMonitor = new Rx.AsyncSubject();

            scheduler.ScheduleWithTime(function() { if (details.onStart) details.onStart(scheduler.currentTime); action(testMonitor); }, 10);
            if (details.underlyingScheduler !== undefined)
            {

                details.underlyingScheduler.ScheduleRecursiveWithTime(function(self)
                {
                    while (scheduler.items[scheduler.currentTime] === undefined && scheduler.currentTime <= scheduler.maxTime)
                    {
                        scheduler.currentTime++;
                        if (details.tick)
                            details.tick(scheduler.currentTime);
                    }
                    if (scheduler.currentTime <= scheduler.maxTime)
                    {
                        var items = scheduler.items[scheduler.currentTime];
                        for (var i = 0; i < items.length; i++)
                        {
                            items[i]();
                        }
                        scheduler.currentTime++;
                        if (details.tick)
                            details.tick(scheduler.currentTime);
                        self(1);
                    }
                    else
                    {
                        testMonitor.OnNext();
                        testMonitor.OnCompleted();
                    }
                }, 1);
                return testMonitor;
            }
            else
            {
                while (scheduler.currentTime <= scheduler.maxTime)
                {
                    var items = scheduler.items[scheduler.currentTime];
                    if (items !== undefined)
                    {
                        for (var i = 0; i < items.length; i++)
                        {
                            items[i]();
                        }
                    }
                    scheduler.currentTime++;
                    if (details.tick)
                        details.tick(scheduler.currentTime);

                }
                testMonitor.OnNext();
                testMonitor.OnCompleted();
                return testMonitor;
            }
        }
        return scheduler;
    };

    testRoot.CreateHotObservable = function(testScheduler, name, notifications, sideEffect)
    {
        var subject = new Rx.Subject();
        for (var i = 0; i < notifications.length; i++)
        {
            (function(i)
            {
                testScheduler.ScheduleWithTime(function() { if (sideEffect) sideEffect(notifications[i]); notifications[i].Accept(subject); }, notifications[i].Time);
            })(i);
        }
        return subject.AsObservable();
    }

    testRoot.CreateColdObservable = function(testScheduler, name, notifications, sideEffect)
    {
        return Rx.Observable.CreateWithDisposable(function(subscriber)
        {
            for (var i = 0; i < notifications.length; i++)
            {
                (function(i)
                {
                    testScheduler.ScheduleWithTime(function() { if (sideEffect) sideEffect(notifications[i]); notifications[i].Accept(subscriber); }, notifications[i].Time);
                })(i);
            }

            return Rx.Disposable.Empty;
        });
    }

    testRoot.CreateUniqueObservable = function(testScheduler, name, notificationList, sideEffect)
    {
        var count = 0;
        return Rx.Observable.CreateWithDisposable(function(subscriber)
        {
            if (count >= notificationList.length)
                throw "No more unique notifications available.";
            var notifications = notificationList[count];
            count++;

            var group = new Rx.CompositeDisposable();
            for (var i = 0; i < notifications.length; i++)
            {
                (function(i)
                {
                    group.Add(testScheduler.ScheduleWithTime(function() { if (sideEffect) sideEffect(notifications[i]); notifications[i].Accept(subscriber); }, notifications[i].Time));
                })(i);
            }

            return group;
        });
    }

    testRoot.TestObserver = function(testScheduler)
    {
        var observer = new Rx.Observer(function(value)
        {
            this.notifications.push(onNext(testScheduler.currentTime, value));
        },
        function(exception)
        {
            this.notifications.push(onError(testScheduler.currentTime, exception));
        },
        function()
        {
            this.notifications.push(onCompleted(testScheduler.currentTime));
        });
        observer.notifications = [];
        return observer;
    }

    var timedNotificationToString = function()
    {
        var begin = this.Kind + "@" + this.Time;
        if (this.Kind == "C")
            return begin;
        return begin + ":" + pp(this.Value);
    };

    var onNext = testRoot.OnNext = function(time, value)
    {
        var notification = new Rx.Notification("N", value);
        notification.Time = time;
        notification.toString = timedNotificationToString;
        return notification;
    }

    var onError = testRoot.OnError = function(time, value)
    {
        var notification = new Rx.Notification("E", value);
        notification.Time = time;
        notification.toString = timedNotificationToString;
        return notification;
    }

    var onCompleted = testRoot.OnCompleted = function(time)
    {
        var notification = new Rx.Notification("C");
        notification.Time = time;
        notification.toString = timedNotificationToString;
        return notification;
    }

    var lookForErrors = function(expected, actual, comparer)
    {
        if (expected.length != actual.length) return "Expecting " + expected.length + " but received " + actual.length;
        for (var i = 0; i < expected.length; i++)
        {
            if (expected[i].Time != actual[i].Time) return "Item " + i + " expected to fire at " + expected[i].Time + " but fired at " + actual[i].Time;
            if (expected[i].Kind != actual[i].Kind) return "Item " + i + " expected to be of kind " + expected[i].Kind + " but was of kind " + actual[i].Kind;
            if (expected[i].Value instanceof Array)
            {
                if (!(actual[i].Value instanceof Array))
                    return "Item " + i + " expected to be an array but was a " + typeof (actual[i].Value);
                var ea = expected[i].Value;
                var aa = actual[i].Value;
                if (ea.length != aa.length)
                    return "Item " + i + " expected array has different size (" + ea.length + ") from actual array (" + aa.length + ").";

                for (var j = 0; j < ea.length; j++)
                {
                    if (!comparer(ea[j], aa[j]))
                        return "Item " + i + ", element " + j + " expected value is " + pp(ea[j]) + " but found " + pp(aa[j]);
                }
            }
            else if (!comparer(expected[i].Value, actual[i].Value)) return "Item " + i + " expected to have value " + pp(expected[i].Value) + " but had value " + pp(actual[i].Value);
        }
        return undefined;
    }

    var runTest = testRoot.RunTest = function(test, details)
    {
        var resultSubject = new Rx.AsyncSubject();
        var argNames = ['scheduler'];
        var body = [];

        for (var i = 0; i < test.inputs.length; i++)
        {
            argNames.push(test.inputs[i].name);
        }
        body.push('return ');
        body.push(test.query);
        body.push(';');


        var code;
        try
        {
            code = new Function(argNames, body.join(""));
        }
        catch (e)
        {
            testMonitor.OnError("Error in " + test.name + " creating function: " + e.message);
            return;
        }
        var comparer = function(a, b) { return a === b };
        if (test.comparer !== undefined)
        {
            try
            {
                comparer = new Function(["a", "b"], "return " + test.comparer + ";");
            }
            catch (e)
            {
                testMonitor.OnError("Error in " + test.name + " creating comparer function: " + e.message);
            }
        }
        var scheduler = testScheduler(details);
        var argValues = [scheduler];
        for (var i = 0; i < test.inputs.length; i++)
        {
            (function(i)
            {
                var item = test.inputs[i];
                var observable;
                if (item.style == 'cold')
                    observable = testRoot.CreateColdObservable(scheduler, item.name, item.values);
                else if (item.style == 'hot')
                    observable = testRoot.CreateHotObservable(scheduler, item.name, item.values);
                else if (item.style == 'unique')
                    observable = testRoot.CreateUniqueObservable(scheduler, item.name, item.values);
                else
                    throw "Unknown observable type: " + item.style;
                argValues.push(observable);
            })(i);
        }
        var resultObserver = new testRoot.TestObserver(scheduler);
        scheduler.Run(function(testMonitor)
        {
            try
            {
                var observable = code.apply(null, argValues);
            }
            catch (e)
            {
                testMonitor.OnError("Error in " + test.name + " applying function: " + e.message);
                return;
            }
            scheduler.ScheduleWithTime(function()
            {
                try
                {
                    if (details.onSubscribe)
                        details.onSubscribe(scheduler.currentTime);
                    var subscription = observable.Subscribe(resultObserver);
                }
                catch (e)
                {
                    testMonitor.OnError("Error in " + test.name + " subscribing: " + e.message);
                    return;
                }
                scheduler.ScheduleWithTime(function()
                {
                    try
                    {
                        if (details.onUnsubscribe)
                            details.onUnsubscribe(scheduler.currentTime);
                        subscription.Dispose();
                    }
                    catch (e)
                    {
                        testMonitor.OnError("Error in " + test.name + " unsubscribing: " + e.message);
                        return;
                    }

                }, 20);
            }, 10);
        })
        .Select(function()
        {
            var message = lookForErrors(test.expected, resultObserver.notifications, comparer);
            return { passed: message === undefined, errorMessage: message, test: test, results: resultObserver.notifications };
        })
        .Subscribe(function(v) { resultSubject.OnNext(v); }, function(e) { resultSubject.OnNext({ passed: false, errorMessage: e, test: test, results: [] }); resultSubject.OnCompleted(); }, function() { resultSubject.OnCompleted(); });
        return resultSubject.AsObservable();
    };
})();
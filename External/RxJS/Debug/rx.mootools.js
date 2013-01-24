// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

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

    var fromMooToolsEvent = observable.FromMooToolsEvent = function(mooToolsObject, eventType) {
        return observable.Create(function(observer) {
            var handler = function(eventObject) {
                observer.OnNext(eventObject);
            };
            
            mooToolsObject.addEvent(eventType, handler);
            
            return function() {
                mooToolsObject.removeEvent(eventType, handler);
            };
        });
    };
    
    var _mooToolsToObservable = function(type) {
        return fromMooToolsEvent(this, type);
    }
    
    Window.implement({
        addEventAsObservable : _mooToolsToObservable
    });
    
    Document.implement({
        addEventAsObservable : _mooToolsToObservable
    });    
    
    Element.implement({
        addEventAsObservable : _mooToolsToObservable
    });  
    
    Elements.implement({
        addEventAsObservable : _mooToolsToObservable
    });     
    
    Events.implement({
        addEventAsObservable : _mooToolsToObservable
    });      
   
    var mooToolsRequest = observable.MooToolsRequest = function(options) {

        var subject = new root.AsyncSubject();
        var request = null;
        
        try {
            newOptions.onSuccess = function(responseText, responseXML) {
                subject.OnNext({ responseText: responseText, responseXML: responseXML });
                subject.OnCompleted();
            };

            newOptions.onFailure = function(xhr) {
                subject.OnError({ kind: "failure", xhr: xhr });
            };
  
            newOptions.onException = function(headerName, value) {
                subject.OnError({ kind: "exception", headerName: headerName, value: value });
            };
            
            request = new Request(newOptions);
            request.send();
        }
        catch(err) {
            subject.OnError(err);
        }

        var refCount = new root.RefCountDisposable(root.Disposable.Create(function() {
            if(request) {
                request.cancel();
            }
        }));

        return observable.CreateWithDisposable(function(subscriber) {
            return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
        });
    };
    
    Request.implement({
        
        toObservable: function () {
            var subject = new root.AsyncSubject();
            var request = this;
            try {
                
                request.addEvents({

                    success: function(responseText, responseXML) {
                        subject.OnNext({ responseXML: responseXML, responseText: responseText });
                        subject.OnCompleted();
                    },

                    failure: function(xhr) {
                        subject.OnError({ kind: "failure", xhr: xhr });
                    },

                    exception: function(headerName, value) {
                        subject.OnError({ kind: "exception", headerName: headerName, value: value });
                    }

                });
                
                request.send();
            }
            catch (err) {
                subject.OnError(err);
            }

            var refCount = new root.RefCountDisposable(root.Disposable.Create(function () {
                request.cancel();
            }));

            return observable.CreateWithDisposable(function (subscriber) {
                return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
            });
        }        
    });    

    observable.MooToolsJSONRequest = function(options)
    {
        var subject = new root.AsyncSubject();
        var request = null;
        
        try {
            newOptions.onSuccess = function(responseJSON, responseText) {
                subject.OnNext({ responseJSON: responseJSON, responseText: responseText });
                subject.OnCompleted();
            };

            newOptions.onFailure = function(xhr) {
                subject.OnError({ kind: "failure", xhr: xhr });
            };
  
            newOptions.onException = function(headerName, value) {
                subject.OnError({ kind: "exception", headerName: headerName, value: value });
            };
            
            request = new Request(newOptions);
            request.send();
        }
        catch(err) {
            subject.OnError(err);
        }

        var refCount = new root.RefCountDisposable(root.Disposable.Create(function() {
            if(request) {
                request.cancel();
            }
        }));

        return observable.CreateWithDisposable(function(subscriber) {
            return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
        });
    }
    
    Request.JSON.implement({
        
        toObservable: function () {
            var subject = new root.AsyncSubject();
            var request = this;
            try {
                
                request.addEvents({

                    success: function(responseJSON, responseText) {
                        subject.OnNext({ responseJSON: responseJSON, responseText: responseText });
                        subject.OnCompleted();
                    },

                    failure: function(xhr) {
                        subject.OnError({ kind: "failure", xhr: xhr });
                    },

                    exception: function(headerName, value) {
                        subject.OnError({ kind: "exception", headerName: headerName, value: value });
                    }

                });
                
                request.send();
            }
            catch (err) {
                subject.OnError(err);
            }

            var refCount = new root.RefCountDisposable(root.Disposable.Create(function () {
                request.cancel();
            }));

            return observable.CreateWithDisposable(function (subscriber) {
                return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
            });
        }        
    });     
    
    observable.MooToolsHTMLRequest = function(options) {
    
        var newOptions = {};
        for (var k in options) {
            newOptions[k] = options[k];
        }

        var subject = new root.AsyncSubject();
        var request = null;
        
        try {
            newOptions.onSuccess = function(html) {
                subject.OnNext(html);
                subject.OnCompleted();
            };

            newOptions.onFailure = function(xhr) {
                subject.OnError({ kind: "failure", xhr: xhr });
            };
  
            newOptions.onException = function(headerName, value) {
                subject.OnError({ kind: "exception", headerName: headerName, value: value });
            };
            
            request = new Request.HTML(newOptions);
            request.send();
        }
        catch(err) {
            subject.OnError(err);
        }

        var refCount = new root.RefCountDisposable(root.Disposable.Create(function() {
            if(request) {
                request.cancel();
            }
        }));

        return observable.CreateWithDisposable(function(subscriber) {
            return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
        });    
    }
    
    Request.HTML.implement({
        
        toObservable: function () {
            var subject = new root.AsyncSubject();
            var request = this;
            try {
                
                request.addEvents({

                    success: function(html) {
                        subject.OnNext(html);
                        subject.OnCompleted();
                    },

                    failure: function(xhr) {
                        subject.OnError({ kind: "failure", xhr: xhr });
                    },

                    exception: function(headerName, value) {
                        subject.OnError({ kind: "exception", headerName: headerName, value: value });
                    }

                });
                
                request.send();
            }
            catch (err) {
                subject.OnError(err);
            }

            var refCount = new root.RefCountDisposable(root.Disposable.Create(function () {
                request.cancel();
            }));

            return observable.CreateWithDisposable(function (subscriber) {
                return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
            });
        }        
    });     
    
    observable.MooToolsJSONPRequest = function(options) {

        var subject = new root.AsyncSubject();
        var request = null;
        
        try {
            options.onSuccess = function(html) {
                subject.OnNext(html);
                subject.OnCompleted();
            };

            options.onFailure = function(xhr) {
                subject.OnError({ kind: "failure", xhr: xhr });
            };
  
            options.onException = function(headerName, value) {
                subject.OnError({ kind: "exception", headerName: headerName, value: value });
            };
            
            request = new Request.JSONP(options);
            request.send();
        }
        catch(err) {
            subject.OnError(err);
        }

        var refCount = new root.RefCountDisposable(root.Disposable.Create(function() {
            if(request) {
                request.cancel();
            }
        }));

        return observable.CreateWithDisposable(function(subscriber) {
            return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
        });    
    }    
    
    Request.JSONP.implement({
        
        toObservable: function () {
            var subject = new root.AsyncSubject();
            var request = this;
            try {
                
                request.addEvents({

                    success: function(data) {
                        subject.OnNext(data);
                        subject.OnCompleted();
                    },

                    failure: function(xhr) {
                        subject.OnError({ kind: "failure", xhr: xhr });
                    },

                    exception: function(headerName, value) {
                        subject.OnError({ kind: "exception", headerName: headerName, value: value });
                    }

                });
                
                request.send();
            }
            catch (err) {
                subject.OnError(err);
            }

            var refCount = new root.RefCountDisposable(root.Disposable.Create(function () {
                request.cancel();
            }));

            return observable.CreateWithDisposable(function (subscriber) {
                return new root.CompositeDisposable(subject.Subscribe(subscriber), refCount.GetDisposable());
            });
        }        
    });    

})();
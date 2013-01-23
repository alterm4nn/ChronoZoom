// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function()
{
	var yuiUse = Rx.Observable.YUI3Use = function(what) 
	{
		return Rx.Observable.CreateWithDisposable(function(observer)
		{			
			var handler = function(y)
			{
				observer.OnNext(y);
			};
			var u = YUI().use(what, handler);
			return Rx.Disposable.Empty;
		});
	};
	var fromYUIEvent = Rx.Observable.FromYUI3Event = function(selector, eventType) 
	{
	    return yuiUse("node-base").SelectMany(function(y)
	    {
		    return Rx.Observable.Create(function(observer)
		    {
	        	var handler = function(eventObject) 
		        {
		            observer.OnNext(eventObject);
	        	};
		        y.on(eventType, handler, selector);
		        return function() 
	        	{
		            y.detach(eventType, handler, selector);
		        };
		    });
	    });	
	};
	
	var fromYUI3IO = Rx.Observable.FromYUI3IO = function(uri, config) {
	    return yuiUse("io-base").SelectMany(function(y) {
	        var internalConfig = {};
		for (var k in config) {
		    internalConfig[k] = config[k];
                }
	    
	        var subject = new Rx.AsyncSubject();
	        
	        internalConfig.on = {
	        	success : function(transactionid, response, arguments) {
	            		  	subject.OnNext({ transactionid : transactionid, response : response, arguments : arguments});
	            			subject.OnCompleted();
                		  },
                
                	failure : function(transactionid, response, arguments) {
	                          	subject.OnError({ transactionid : transactionid, response : response, arguments : arguments});
                        	  }
                };
                
                y.io(uri, internalConfig);
                
                return subject;
	    });
	};
})();
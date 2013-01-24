// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function(){var a;if(typeof ProvideCustomRxRootObject =="undefined")a=this.Rx; else a=ProvideCustomRxRootObject();var b=a.Observable;var c=function(d,e){return b.Create(function(f){var g=function(h){f.OnNext(h);};Element.observe(d,e,g);return function(){Element.stopObserving(d,e,g);};});};Element.addMethods({toObservable:function(d,e){return c(d,e);}});Ajax.observableRequest=function(d,e){var f={};for(var g in e) f[g]=e[g];var h=new a.AsyncSubject();f.onSuccess=function(j){h.OnNext(j);h.OnCompleted();};f.onFailure=function(j){h.OnError(j);};var i=new Ajax.Request(d,f);return h;};Enumerable.addMethods({toObservable:function(d){if(d===undefined)d=a.Scheduler.Immediate;return b.FromArray(this.toArray());}});})();
// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function(){var a=google.language;var b=this;var c;if(typeof ProvideCustomRxRootObject =="undefined")c=b.Rx; else c=ProvideCustomRxRootObject();var d=c.AsyncSubject;a.detectAsObservable=function(e){var f=new d();var g=function(h){if(!h.error){f.OnNext(h);f.OnCompleted();}else f.OnError(h.error);};a.detect(e,g);return f;};a.translateAsObservable=function(e,f,g){var h=new d();var i=function(j){if(!j.error){h.OnNext(j);h.OnCompleted();}else h.OnError(j.error);};a.translate(e,f,g,i);return h;};})();
// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function(){var a=this;var b;if(typeof ProvideCustomRxRootObject =="undefined")b=a.Rx; else b=ProvideCustomRxRootObject();var c=b.Observable;var d=c.Create;Raphael.el.toObservable=function(e){var f=this;return d(function(g){var h=function(i){g.OnNext(i);};f[e](h);return function(){f["un"+e](h);};});};Raphael.el.hoverAsObservable=function(e){var f=this;return d(function(g){var h=function(j){j=j||window.event;g.OnNext({hit:true,event:j});};var i=function(j){j=j||window.event;g.OnNext({hit:false,event:j});};f.hover(h,i);return function(){f.unhover(h,i);};});};})();
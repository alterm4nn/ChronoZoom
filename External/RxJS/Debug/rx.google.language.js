// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function () {

    var proto = google.language;
    var global = this;
    var root;
    if (typeof ProvideCustomRxRootObject == "undefined") {
        root = global.Rx;
    }
    else {
        root = ProvideCustomRxRootObject();
    }

    var asyncSubject = root.AsyncSubject;

    proto.detectAsObservable = function (text) {
        var subject = new asyncSubject();

        var handler = function (result) {
            if (!result.error) {
                subject.OnNext(result);
                subject.OnCompleted();
            }
            else {
                subject.OnError(result.error);
            }
        };

        proto.detect(text, handler);

        return subject;
    };

    proto.translateAsObservable = function (text, from, to) {
        var subject = new asyncSubject();

        var handler = function (result) {
            if (!result.error) {
                subject.OnNext(result);
                subject.OnCompleted();
            }
            else {
                subject.OnError(result.error);
            }
        };

        proto.translate(text, from, to, handler);

        return subject;
    };

})();
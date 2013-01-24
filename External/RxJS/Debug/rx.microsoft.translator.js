// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function () {
    var _jQuery = jQuery;
    var proto = _jQuery.fn;
    var global = this;
    var root;
    var rxRoot;

    if (!global.Microsoft) {
        root = global.Microsoft = {};
    }
    else {
        root = global.Microsoft;
    }

    var baseUrl = "http://api.microsofttranslator.com/V2/Ajax.svc/";
    var selector = function (d) { return d.data; };

    var translator = root.Translator = function (appId) {

        this.addTranslation = function (originalText, translatedText, from, to, options) {

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "AddTranslation",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId,
                            originalText: originalText, 
                            translatedText: translatedText,
                            from: from, 
                            to: to,
                            user: options.user,
                            rating: options.rating,
                            contentType: options.contentType,
                            category: options.category,
                            uri: options.uri
                    }
                })
            .Select(selector);
        };

        this.addTranslationArray = function (translations, from, to, options) {

            var translationValues = JSON.stringify(translations);
            var optionvalues = JSON.stringify(options);

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "AddTranslationArray",
                  dataType: "jsonp",
                  jsonp: "oncomplete",
                  data: { appId: appId, translations: translationValues, from: from, to: to, options : optionvalues }
                })
            .Select(selector);
        };

        this.breakSentences = function (text, language) {

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "BreakSentences",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId, text: text, language: language }
                })
                .Select(selector);
        };

        this.detect = function (text) {

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "Detect",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId, text: text }
                })
                .Select(selector);
        };

        this.detectArray = function (texts) {

            var textValues = JSON.stringify(texts);

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "DetectArray",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId, texts: textValues }
                })
                .Select(selector);
        };

        this.getLanguageNames = function (locale, languageCodes) {

            var languageCodeValues = JSON.stringify(languageCodes);

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "GetLanguageNames",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId, locale: locale, languageCodes: languageCodeValues }
                })
                .Select(selector);
        };

        this.getLanguagesForSpeak = function () {

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "GetLanguagesForSpeak",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId }
                })
                .Select(selector);
        };

        this.getLanguagesForTranslate = function () {

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "GetLanguagesForTranslate",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId }
                })
                .Select(selector);
        };

        this.getTranslations = function (text, from, to, maxTranslations, options) {

            var optionvalues = JSON.stringify(options);

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "GetTranslations",
                  dataType: "jsonp",
                  jsonp: "oncomplete",
                  data: { appId: appId, text: text, from: from, to: to, maxTranslations: maxTranslations, options: optionvalues }
                })
            .Select(selector);
        };

        this.getTranslationsArray = function (texts, from, to, maxTranslations, options) {

            var textValues = JSON.stringify(texts);
            var optionvalues = JSON.stringify(options);

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "GetTranslationsArray",
                  dataType: "jsonp",
                  jsonp: "oncomplete",
                  data: { appId: appId, texts: textValues, from: from, to: to, maxTranslations: maxTranslations, options: optionvalues }
                })
            .Select(selector);
        };

        this.speak = function (text, language, format) {

            if (format == null) {
                format = "audio/wav";
            }

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "Speak",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId, text: text, language: language, format: format }
                })
                .Select(selector);
        };

        this.translate = function (text, from, to) {

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "Translate",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId, text: text, from: from, to: to }
                })
                .Select(selector);
        };

        this.translateArray = function (texts, from, to, options) {

            var textValues = JSON.stringify(texts);
            var optionvalues = JSON.stringify(options);

            return _jQuery.ajaxAsObservable(
                { url: baseUrl + "TranslateArray",
                    dataType: "jsonp",
                    jsonp: "oncomplete",
                    data: { appId: appId, texts: textValues, from: from, to: to, options: optionvalues }
                })
            .Select(selector);
        };
    };

    root.Translator.getAppIdToken = function(appId, minRatingRead, maxRatingRead, expireSeconds) {
        return _jQuery.ajaxAsObservable(
            { url: baseUrl + "GetAppIdToken",
              dataType: "jsonp",
              jsonp: "oncomplete",
              data: { appId: appId, minRatingRead: minRatingRead, maxRatingRead: maxRatingRead, expireSeconds: expireSeconds }
            })
            .Select(selector);        
    }

})();
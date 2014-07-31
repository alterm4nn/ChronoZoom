/*
    Notes:
    -----
    Provides speech input processing. See https://github.com/TalAter/annyang and https://www.talater.com/annyang/.
    Depends on  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/annyang/1.1.0/annyang.min.js"></script>.
    Requires an HTML5 browser that supports voice input, currently only Google Chrome but IE12 will also have this feature.
*/
var CZ;
(function (CZ) {
    (function (Voice) {

        // wrapper functions for each speech input command

        function Find(item)
        {
            if (typeof item !== 'string') return;

            CZ.Service.getSearch(item).done(function (results)
            {
                if (results === null || results.d.length === 0)
                {
                    // tell user could not find
                    alert('Could not find "' + item + '".');
                }
                else
                {
                    // close other panes and display timelines
                    CZ.HomePageViewModel.closeAllForms();
                    CZ.StartPage.hide();

                    // navigate to first item found
                    var result = results.d[0];

                    var resultIdPrefixes =
                    {
                        0:  'e',
                        1:  't',
                        2:  ''
                    };

                    var resultTypes =
                    {
                        0:  'exhibit',
                        1:  'timeline',
                        2:  'contentItem'
                    };

                    CZ.Search.goToSearchResult
                    (
                        resultIdPrefixes[result.objectType]  + result.id,
                        resultTypes[     result.objectType]
                    );
                }
            });
        }

        function MoveTo(item)
        {
            if (typeof item !== 'string') return;

            alert('show me ' + item);
        }

        function ShowHomePage()
        {
            alert('show home page');
        }

        function ShowTimelines()
        {
            alert('show timelines');
        }

        function SwitchCollection(item)
        {
            if (typeof item !== 'string') return;

            alert('explore ' + item);
        }

        function TourLast()
        {
            alert('next item');
        }

        function TourNext()
        {
            alert('previous item');
        }

        function TourPause()
        {
            alert('pause tour');
        }

        function TourResume()
        {
            alert('resume tour');
        }

        // make each wrapper public so can be called later by speech engine
        Voice.Find              = Find;
        Voice.MoveTo            = MoveTo;
        Voice.ShowHomePage      = ShowHomePage;
        Voice.ShowTimelines     = ShowTimelines;
        Voice.SwitchCollection  = SwitchCollection;
        Voice.TourLast          = TourLast;
        Voice.TourNext          = TourNext;
        Voice.TourPause         = TourPause;
        Voice.TourResume        = TourResume;

        // if speech is enabled in both web config and browser
        if (constants.speechInputEnabled && annyang)
        {
            // map speech commands to wrappers
            var commands =
            {
                'explore *item':    CZ.Voice.SwitchCollection,
                'pause tour':       CZ.Voice.TourPause,
                'resume tour':      CZ.Voice.TourResume,
                'previous item':    CZ.Voice.TourLast,
                'next item':        CZ.Voice.TourNext,
                'show timelines':   CZ.Voice.ShowTimelines,
                'show home page':   CZ.Voice.ShowHomePage,
                'show me *item':    CZ.Voice.MoveTo,
                'find *item':       CZ.Voice.Find               // <-- currently this is the only item testing with
            };

            // initiate speech engine
            annyang.setLanguage('en');
            annyang.addCommands(commands);
            annyang.start();
        }

    })(CZ.Voice || (CZ.Voice = {}));
    var Voice = CZ.Voice;
})(CZ || (CZ = {}));

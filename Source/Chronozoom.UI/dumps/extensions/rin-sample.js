[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "6aa09d19-cf2b-4c8e-8b57-7ea8701794f7",
            "timestamp": "2011-07-29T00:48:12.8847651Z",
            "title": "Light weight Narrative",
            "author": "Aldo",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 37,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {
        "PlaceholderES": {
            "name": "MicrosoftResearch.Rin.PlaceholderExperienceStream",
            "version": 0.0
        },
        "FadeInOutTransitionService": {
            "name": "MicrosoftResearch.Rin.FadeInOutTransitionService",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
            "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
            "version": 0.0
        }
    },
    "resources": {
    },
    "experiences": {
        "PlaceHolder-1": {
            "providerId": "MicrosoftResearch.Rin.LiteDiscreteExperienceStream",
            "data": {
                "mode": "stresstest",
                "markers": {
                    "beginAt": 0,
                    "endAt": 37
                },
                "transition": {
                    "providerId": "FadeInOutTransitionService",
                    "inDuration": 0.5,
                    "outDuration": 0.5
                }
            },
            "resourceReferences": [],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 37,
                    "keyframes": [
                        {
                            "offset": 2,
                            "holdDuration": 0,
                            "state": {
                                "text": "Interpolating value to 500", "value": 0
                            }
                        },
                        {
                            "offset": 8,
                            "holdDuration": 0,
                            "state": {
                                "text": "Interpolating value to 10", "value": 500
                            }
                        },
                        {
                            "offset": 10,
                            "holdDuration": 0,
                            "state": {
                                "text": "Interpolating value to 10000", "value": 10
                            }
                        },
                        {
                            "offset": 20,
                            "holdDuration": 0,
                            "state": {
                                "text": "Interpolating value to 200", "value": 10000
                            }
                        },
                        {
                            "offset": 35,
                            "holdDuration": 0,
                            "state": {
                                "text": "Interpolating value to 0", "value": 200
                            }
                        },
                        {
                            "offset": 36,
                            "holdDuration": 0,
                            "state": {
                                "text": "Demo Complete.", "value": 0
                            }
                        },
                        {
                            "offset": 37,
                            "holdDuration": 0,
                            "state": {
                                "text": "Demo Complete.", "value": 0
                            }
                        }

                    ]
                }
            }
        }
    },
    "screenplays": {
        "SCP1": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "PlaceHolder-1",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 37,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                    }
                ]
            }
        }
    }
}]
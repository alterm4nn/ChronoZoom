/*! RIN | http://research.microsoft.com/rin | 2013-07-23 */
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
rin.contracts = rin.contracts || {};

// Simple event class to enable pub-sub pattern. All rin events use this class.
rin.contracts.Event = function () {
    var callbackItems = {};

    return {
        // To subscribe to this event, call this method.
        // callback: callback function to be called when an event is published.
        // id: Optional unique id to identify this subscription. If not specified, callback pointer is used as id.
        // context: Optional context under which the callback needs to be called. If specified, the "this" variable inside the callback will refer to this context object.
        subscribe: function (callback, id, context) {
            if (typeof (callback) != "function") throw new Error("Event callback needs to be a function");
            callbackItems[id || callback] = { callback: callback, context: context || this };
        },

        // To unsubscribe, call this method with the subscription id.
        unsubscribe: function (id) {
            delete callbackItems[id];
        },

        // To publish the event, call this method with the arguments for the callbacks.
        publish: function (eventArgs, isAsync) {
            for (var id in callbackItems) {
                var callbackItem = callbackItems[id];
                if (isAsync) {
                    (function (callbackItem) {
                        setTimeout(function () { callbackItem.callback.call(callbackItem.context, eventArgs); }, 0);
                    })(callbackItem);
                }
                else {
                    callbackItem.callback.call(callbackItem.context, eventArgs);
                }
            }
        }
    }
}

// enum of states a experience stream can be in. All experience streams start at closed state, then move to buffering (if buffering is required), and then to ready or error state.
rin.contracts.experienceStreamState = {
    closed: "closed",
    buffering: "buffering",
    ready: "ready",
    error: "error"
};

// An experience provider needs to implement following methods.
//    load: function (experienceStreamId) { } // Load experience stream contents at the passed experienceStreamId
//    play: function (offset, experienceStreamId) { } // Play contents from the given offset & experienceStreamId
//    pause: function (offset, experienceStreamId) { } // Pause experience stream with the first frame displayed at given offset & experienceStreamId
//    unload: function () { } // Release all resources and unload
//    getState: function () { } // Return current state - one of states listed in rin.contracts.experienceStreamState
//    stateChangedEvent: new rin.contracts.Event() // Publish this event whenever current state changes. Callers can subscribe to this event. 
                                                   // The publisher should pass an instance of rin.contracts.ESStateChangedEventArgs to describe state change information.
//    getUserInterfaceControl: function () { } // Return html element that displays contents of this experience provider.

// Class that describes the event arguments on state changed event.
rin.contracts.ESStateChangedEventArgs = function (fromState, toState, source) {
    this.fromState = fromState;
    this.toState = toState;
    this.source = source;
};

// The UI layer an experience stream can be in. This describes implicit z-index of the experience's user interface control. This is specified in RIN data model.
rin.contracts.experienceStreamLayer = {
    background: "background",
    foreground: "foreground",
    overlay: "overlay",
    projection: "projection"
};

// List of events that an ES can broadcast to other ESs or receive from other ESs. To broadcast an event, call orchestrator.onESEvent with event id and event related data.
// To listen to esEvents broadcasted by other ESs, implement onESEvent method in experience provider and react to events.
rin.contracts.esEventIds = {
    stateTransitionEventId: "stateTransitionEvent", // This event is raised by an ES to continously broadcast changes in state information. 
    playerConfigurationChanged: "playerConfigurationChanged", // This event is raised whenever player configuration is changed at run time.
    popupDisplayEvent: "popupDisplayEvent",
    resumeTransitionEvent: "resumeTransition"
};

// Enum of system interaction controls available for an ES to use. Refer to developer documentation for how to get a system interaction control.
rin.contracts.interactionControlNames = {
    panZoomControl: "MicrosoftResearch.Rin.InteractionControls.PanZoomControl",
    mediaControl: "MicrosoftResearch.Rin.InteractionControls.MediaControl"
};

// Enum of types of factories that rin.ext registers and gives out. These are only system factories and rin.ext allows any type of factory to be registered.
rin.contracts.systemFactoryTypes = {
    esFactory: "ESFactory",
    interactionControlFactory: "InteractionControlFactory",
    behaviorFactory: "BehaviorFactory"
}

// A single instance class that holds plugins such as factories. Registering and getting factory methods such as "ES factories", "Interaction control factories" etc can be done here.
rin.ext = (function () {
    var defaultESFactoryFunction = null;
    var factoriesTypeMap = {};
    var defaultFactoryProviderId = "MicrosoftResearch.Rin.DefaultFactoryProvider";

    return {
        // Registers a factory. 
        // factoryType: Any string that identifies a specific factory type. Could be a value from rin.contracts.systemFactoryTypes or any unique string. 
        // providerTypeId: unique string that identifies a provider type.
        // factoryFunction: Function that return an instance of an object.
        // isSupportedCheckFunction: A function that takes version number as param and returns true if that version is supported.
        registerFactory: function (factoryType, providerTypeId, factoryFunction, isSupportedCheckFunction) {
            var factories = factoriesTypeMap[factoryType] || (factoriesTypeMap[factoryType] = []);
            factories.push({ providerTypeId: providerTypeId, factoryFunction: factoryFunction, isSupportedCheckFunction: isSupportedCheckFunction });
        },

        // Returns factory function for given factoryType string, providerTypeId string and optional version number.
        getFactory: function (factoryType, providerTypeId, version) {
            var factories = factoriesTypeMap[factoryType];
            if (!factories) return null;

            for (var i = factories.length - 1; i >= 0; i--) { 
                var factory = factories[i];
                if (factory.providerTypeId == providerTypeId) {
                    if (!version || typeof (factory.isSupportedCheckFunction) != "function" || factory.isSupportedCheckFunction(version)) return factory.factoryFunction;
                }
            }

            return factories[defaultFactoryProviderId];
        },

        // Sets default factory function for a given factory type. If no factory funtion is found for a given providerTypeId, this default factory is used.
        setDefaultFactory: function (factoryType, defaultFactoryFunction) {
            var factories = factoriesTypeMap[factoryType] || (factoriesTypeMap[factoryType] = []);
            factories[defaultFactoryProviderId] = defaultFactoryFunction;
        }
    };
})();
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
rin.contracts = rin.contracts || {};

// Enum that lists possible states RIN player can be in.
rin.contracts.playerState = {
    stopped: "stopped", // Initial state of the player. Player is stopped and not playing any content.
    pausedForBuffering: "pausedForBuffering", // Player is paused and is buffering content. Player will resume when enough content is buffered.
    pausedForExplore: "pausedForExplore", // Player is paused because user is interacting with the player. 
    playing: "playing", // Player is playing content.
    inTransition: "inTransition" // Player's state is in the middle of change. This state is set when player is changing from one state to another, for example, from stopped to playing.
};

// Enum that lists possible modes RIN player can be in.
rin.contracts.playerMode = {
    Demo: "demo", // Player is playing content from local narratives folder. Used during development and demoing from locally hosted content.
    Published: "published", // Player is hosted in some hosting solution like azure and is playing narrative & content pointed by web URLs.
    AuthorerPreview: "authorerPreview", // Player is playing inside an authoring tool's preview window. Authoring tool specific UI elements might be visible in this mode.
    AuthorerEditor: "authorerEditor" // Player is playing inside an authoring tool's path editor window. Path editing related UI controls & functionality may be visible in this mode.
};

// Enum that lists possible actions on narrative data load.
rin.contracts.playerStartupAction =
{
    play: "play", // Immediately play contents after loading
    pause: "pause", // Pause player at first frame after loading
    none: "none" // No action after load, continue to show blank screen
};

// Aspect ratio of narrative. This is specified in narrative data model.
rin.contracts.narrativeAspectRatio =
{
    none: "none",
    normal: "normal",
    wideScreen: "wideScreen"
};

// Class that specified event arguments of player state changed event.
rin.contracts.PlayerStateChangedEventArgs = function (previousState, currentState) {
    this.previousState = previousState;
    this.currentState = currentState;
};

rin.contracts.PlayerStateChangedEventArgs.prototype = {
    previousState: rin.contracts.playerState.stopped,
    currentState: rin.contracts.playerState.stopped
};

// Class that specified event arguments of player ES event.
rin.contracts.PlayerESEventArgs = function (sender, eventId, eventData) {
    this.sender = sender; this.eventId = eventId; this.eventData = eventData;
};
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};
rin.contracts = rin.contracts || {};

// Base class for any ES which uses keyframes at discrete intervals.
rin.contracts.DiscreteKeyframeESBase = function (orchestrator, esData) {
    this._esData = esData;
    this._orchestrator = orchestrator;
    this._keyframes = new rin.internal.List();
    this.stateChangedEvent = new rin.contracts.Event();
    this._state = rin.contracts.experienceStreamState.closed;
};

rin.contracts.DiscreteKeyframeESBase.prototype = {
    // Notify ES stage change.
    stateChangedEvent: null,
    // Method called every time a keyframe has to be applied.
    displayKeyframe: function (keyframeData) { },
    // Reset the UI.
    resetUserInterface: function () { },
    // Load the ES and initialize its components.
    load: function (experienceStreamId) {
        if (!this._esData || !this._orchestrator) throw new Error("orchestrator and esData should not be null. Make sure the base ES is instantiated using non-empty constructor during run time");
        this._initKeyframes(experienceStreamId);
    },
    // Play the ES from the specified offset.
    play: function (offset, experienceStreamId) {
        if (this.getState() == rin.contracts.experienceStreamState.error) {
            //do nothing
            return;
        }
        this.isLastActionPlay = true;
        if (this._taskTimer) {
            var isSeeked = this._seek(offset, experienceStreamId);
            this._taskTimer.play();
            if (!isSeeked && this._lastKeyframe) {
                var nextKeyframe = this._getNextKeyframe(this._lastKeyframe);
                var interpolationOffset = offset - this._lastKeyframe.offset;
                rin.internal.debug.assert(interpolationOffset >= 0);
                this._loadKeyframe(this._lastKeyframe, nextKeyframe, interpolationOffset);
            }
        }
    },
    // Pause the ES at the specified offset.
    pause: function (offset, experienceStreamId) {
        this.isLastActionPlay = false;
        if (this._taskTimer) {
            this._seek(offset, experienceStreamId);
            this._taskTimer.pause();
        }
    },

    // Unload the ES and release any resources.
    unload: function () {
        this.pause();
    },

    // Get the current state of this ES.
    getState: function () {
        return this._state;
    },

    // Get the state if this ES.
    setState: function (value) {
        if (this._state == value) return;
        var previousState = this._state;
        this._state = value;
        this.stateChangedEvent.publish(new rin.contracts.ESStateChangedEventArgs(previousState, value, this));

        if (this._taskTimer && this._state == rin.contracts.experienceStreamState.ready && previousState != rin.contracts.experienceStreamState.ready) {
            this._loadKeyframeAtOffset(this._taskTimer.getCurrentTimeOffset());
        }
    },
    getUserInterfaceControl: function () { return this._userInterfaceControl; },
    isLastActionPlay: false,

    // Load and initialize the keyframes and the timer.
    _initKeyframes: function (experienceStreamId) {
        var currentExperienceStreamId = experienceStreamId;
        if (!this._isValidExperienceStreamId(currentExperienceStreamId)) {
            rin.internal.debug.assert(false, "invalid experience stream id");
            this._orchestrator.eventLogger.logErrorEvent("Requested experience stream {0} missing in datamodel", currentExperienceStreamId);            
        } else {
            var self = this;
            this._keyframes = this._esData.experienceStreams[experienceStreamId].keyframes;
            if (this._taskTimer) this._taskTimer.pause();
            this._taskTimer = new rin.internal.TaskTimer();
            this._taskTimer.taskTriggeredEvent.subscribe(function (triggeredItems) { self._taskTimer_taskTriggered(triggeredItems) });
            if (this._keyframes && this._keyframes != null) {
                this._keyframes.sort(function (a, b) { return a.offset - b.offset; });
                for (var i = 0, len = this._keyframes.length; i < len; i++) {
                    var keyframe = this._keyframes[i];
                    this._taskTimer.add(parseFloat(keyframe.offset), keyframe);
                }
            }
            this._lastKeyframe = null;
            this._currentExperienceStreamId = currentExperienceStreamId;
        }
    },

    // Check if the experienceStreamId is valid.
    _isValidExperienceStreamId: function (experienceStreamId) {
        return experienceStreamId && this._esData.experienceStreams[experienceStreamId];
    },

    // Method called every time the timer triggers.
    _taskTimer_taskTriggered: function (triggeredItems) {
        var lastKeyframe = triggeredItems.lastOrDefault();
        var nextKeyframe = this._getNextKeyframe(lastKeyframe);
        this._loadKeyframe(lastKeyframe, nextKeyframe);
    },

    // Load a specified keyframe.
    _loadKeyframe: function (keyframeData, nextKeyframeData, interpolationOffset) {
        this._lastKeyframe = keyframeData;

        if (keyframeData) this.displayKeyframe(keyframeData, nextKeyframeData, interpolationOffset || 0);
        else this.resetUserInterface();
    },

    // Seek to the specified offset.
    _seek: function (offset, experienceStreamId) {
        var isSeeked = false;
        if (experienceStreamId != this._currentExperienceStreamId && this._isValidExperienceStreamId(experienceStreamId)) {
            this.resetUserInterface();
            this._initKeyframes(experienceStreamId);
            isSeeked = true;
        }
        this._currentExperienceStreamId = experienceStreamId; //change current ESId even if the name is not valid. Sometimes non-existent ESIDs are used in screenplay for features like preserveContinuity in audio.

        var epsilon = .05;
        var currentTimeOffset = this._taskTimer.getCurrentTimeOffset();
        if (this._taskTimer && (isSeeked || Math.abs(currentTimeOffset - offset) > epsilon)) {
            this._taskTimer.seek(offset);
            this._loadKeyframeAtOffset(offset);
            isSeeked = true;
        }
        return isSeeked;
    },

    // Load keyframe from a specified offset.
    _loadKeyframeAtOffset: function (offset) {
        var lastKeyframe = this._taskTimer.getCurrentOrPrevious(offset);
        if (!lastKeyframe) return true; // exit is there is no lastkeyframe

        var nextKeyframe = this._getNextKeyframe(lastKeyframe);
        var interpolationOffset = offset - lastKeyframe.offset;
        rin.internal.debug.assert(interpolationOffset >= 0);
        this._loadKeyframe(lastKeyframe, nextKeyframe, interpolationOffset);
    },

    // Find the next keyframe.
    _getNextKeyframe: function (keyframeData) {
        var keyframeIndex = keyframeData ? this._keyframes.indexOf(keyframeData) : -1;
        return (keyframeIndex >= 0 && (keyframeIndex + 1) < this._keyframes.length) ? this._keyframes[keyframeIndex + 1] : null;
    },

    _keyframes: null,
    _lastKeyframe: null,
    _currentExperienceStreamId: null,
    _taskTimer: null,
    _userInterfaceControl: null,
    _orchestrator: null,
    _esData: null
};
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};
rin.contracts = rin.contracts || {};

// Base class for any ES which uses keyframes at discrete intervals.
rin.contracts.InterpolatedKeyframeESBase = function (orchestrator, esData) {
    this._esData = esData;
    this._orchestrator = orchestrator;
    this.stateChangedEvent = new rin.contracts.Event();
};

rin.contracts.InterpolatedKeyframeESBase.prototype = {
    // Notify ES stage change.
    stateChangedEvent: null,
    // Method called every time a keyframe has to be applied.
    displayKeyframe: function (keyframeData) { },
    // Reset the UI.
    resetUserInterface: function () { },
    // Load the ES and initialize its components.
    load: function (experienceStreamId) {
        if (!this._esData || !this._orchestrator) throw new Error("orchestrator and esData should not be null. Make sure the base ES is instantiated using non-empty constructor during run time");
        this._initKeyframes(experienceStreamId);
    },
    // Play the ES from the specified offset.
    play: function (offset, experienceStreamId) {
        this._updateActiveES(offset, experienceStreamId);
        if (this.getState() != rin.contracts.experienceStreamState.ready)
            return;
        
        if (this._interpolationStoryBoard && this._currentStreamTrajectory)
            this._interpolationStoryBoard.play(this._currentStreamTrajectory, offset);
    },
    // Pause the ES at the specified offset.
    pause: function (offset, experienceStreamId) {
        this._updateActiveES(offset, experienceStreamId);
        if (this.getState() != rin.contracts.experienceStreamState.ready)
            return;
        
        if (this._interpolationStoryBoard && this._currentStreamTrajectory)
        {
            this._interpolationStoryBoard.pause(this._currentStreamTrajectory, offset);
        }
    },

    // Unload the ES and release any resources.
    unload: function () {
        this.pause();
        if (this._interpolationStoryBoard)
            this._interpolationStoryBoard.stop();
    },

    // Get the current state of this ES.
    getState: function () {
        return this._state;
    },

    // Get the state if this ES.
    setState: function (value) {
        if (this._state == value) return;
        var previousState = this._state;
        this._state = value;
        this.stateChangedEvent.publish(new rin.contracts.ESStateChangedEventArgs(previousState, value, this));
    },

    // Get the UI control for this ES.
    getUserInterfaceControl: function () { return this._userInterfaceControl; },

    // Add a sliver interpolator to this ES.
    addSliverInterpolator : function(key, interpolatorFunction) {
        this._sliverInterpolators[key] = interpolatorFunction;
    },
    
    // Used to fetch keyframes for a specified time span
    getKeyframes: function (start, duration, step) {
        var keyframeArray = [];
        var tmpFrame;

        for (var offset = 0; offset <= duration; offset += step) {
            tmpFrame = this._interpolationStoryBoard.getFrameAt(start + offset, this._currentStreamTrajectory);
            if (tmpFrame != null)
                keyframeArray.push(tmpFrame);
        }

        return keyframeArray;
    },

    getKeyframeAt: function (offset, experienceStreamId){
        this._updateActiveES(offset, experienceStreamId);

        if (this._interpolationStoryBoard && this._currentStreamTrajectory)
            return this._interpolationStoryBoard.getFrameAt(offset, this._currentStreamTrajectory);
    },

    // Load and initialize the keyframes and the timer.
    _initKeyframes: function (experienceStreamId) {
        var self = this;
        var doRenderLoop = false;

        if (!this._esData.experienceStreams[experienceStreamId] || !this._esData.experienceStreams[experienceStreamId].keyframes || !this._esData.experienceStreams[experienceStreamId].keyframes.length)
            return;
        var trajectoryBuilder = this._trajectoryBuilder;
        if (!trajectoryBuilder) {
            trajectoryBuilder = rin.Ext.Trajectory.newTrajectoryBuilder(this._esData);

            trajectoryBuilder.sliverInterpolator = function (sliverId, iState) {
                if (typeof(self._sliverInterpolators[sliverId]) == "function")
                    return self._sliverInterpolators[sliverId](sliverId, iState);

                return null;
            };

            trajectoryBuilder.storyboardHelper.startAnimation = function () {
                doRenderLoop = true;

                function renderLoop () {
                    if (self._interpolationStoryBoard)
                        self._interpolationStoryBoard.render();
                    if(doRenderLoop)
                        rin.internal.requestAnimFrame(renderLoop);
                }
                renderLoop();
            };

            trajectoryBuilder.storyboardHelper.stopAnimation = function () {
                doRenderLoop = false;
            };

            trajectoryBuilder.renderKeyframe = function (kf) {
                self.displayKeyframe(kf);
            }

            // Override buildTransitionTrajectory to get smoothTransitions
            //TODO: Adding the check for overrideTransientTrajectoryBuilder so that by default smoothTransitions are not turned on.
            // Remove this check for overrideTransientTrajectoryBuilder once sufficient testing is done
            if (self.overrideTransientTrajectoryFunction) {
                trajectoryBuilder.storyboardHelper.buildTransitionTrajectory = function (traj1, t1, traj2, t2, pause) {

                    if (traj2 && traj2.es && (traj2.es.transitionType == "noZoomOut" || traj2.es.transitionType == "noAnimation")) {
                        //A very special case - we will not attempt any transition trajectory building here 
                        // We expect traj2 to only have a single keyframe.
                        // Typically this is called after resumeFrom originating from a hotspot
                        // resumeFrom would have either set the view to that single keyframe in traj2 or if the view is a zoomed-in view compared to that 
                        // single keyframe, left it as-is. we will not attempt to change the view either 
                        var currentKF = self.captureKeyframe();

                        var noZoomOutTraj = {
                            duration : traj2.duration,

                            renderAt: function(number) {
                                self.displayKeyframe(currentKF);
                            },

                            sampleAt: function (number, Keyframe) {
                                // BUG - must populate Keyframe, or create a *copy* if Keyframe is null!
                                return currentKF;
                            }
                        }

                        if (!pause) {
                            self._playCalled = true; //probably already true
                        }
                        // Early return
                        return noZoomOutTraj;
                    }


                    // Special case code for pause that will create a transient trajectory that keeps the view at currentKF if it is meant to 
                    // pause in the same trajectory with same offset.
                    if (pause && // we are pausing
                        traj1 && // we have a non-null current/active trajectory
                            traj2.targetExperienceStreamId && traj1.targetExperienceStreamId === traj2.targetExperienceStreamId && // the target trajectory for the new traj (traj2) is same as that of current/active traj (traj1)
                            (Math.abs(t1 - t2) < 1E-1)) { // The current and new offsets are very close
                        var currentKF = self.captureKeyframe();

                        // we are already there - no need to change the view, keep it at currentKF
                        var esPause = {
                            duration: 0,
                            keyframes: [currentKF]
                        };

                        //EARLY RETURN!!
                        return trajectoryBuilder.buildTrajectoryFromExperienceStream(esPause);
                    }

                    // Check if we want to use adaptive/variable time to get to the second keyframe of the traj2
                    var useAdaptiveDuration = (traj2.es && traj2.es.transitionType && traj2.es.transitionType == "adaptiveFirstDuration");
                    //We expect to have atleast 2 keyframes in the adaptiveFirstDuration case
                    rin.internal.debug.assert(!useAdaptiveDuration || (useAdaptiveDuration && traj2.es.keyframes.length >= 2));
                    if (useAdaptiveDuration && traj2.es.keyframes.length >= 2 && !pause && self._playCalled)
                    {
                        rin.internal.debug.assert(t2 <= traj2.duration);
                        var currentKF = self.captureKeyframe();
                        currentKF.offset = t2;
                        currentKF.holdDuration = 0;
                        // Find out the keyframe in traj2 that will follow t2 
                        var keyframesNew;
                        var secondAdaptiveKF;

                        
                        // Handle border case first - 
                        if (t2 > traj2.es.keyframes[traj2.es.keyframes.length - 1].offset || Math.abs(t2 - traj2.es.keyframes[traj2.es.keyframes.length - 1].offset) < 1E-5) {
                            // t2 is beyond the last keyframe or very close to it, we will insert a keyframe at offset = duration
                            secondAdaptiveKF = rin.util.deepCopy(traj2.es.keyframes[traj2.es.keyframes.length - 1]);
                            secondAdaptiveKF.offset = traj2.es.duration;
                            keyframesNew = [currentKF, secondAdaptiveKF];
                        }
                        else {
                            var nextKf = null;
                            for (var kf in traj2.es.keyframes) {
                                if (traj2.es.keyframes[kf].offset > t2) {
                                    //found the keyframe
                                    nextKf = traj2.es.keyframes[kf];
                                    break;
                                }
                            }
                            rin.internal.debug.assert(nextKf != null);
                            var index;
                            if (nextKf == null) {
                                //TODO: what else could we do here?
                                index = traj2.es.keyframes.length - 1;
                                nextKf = traj2.es.keyframes[index];
                            }
                            else {
                                index = traj2.es.keyframes.indexOf(nextKf);
                            }

                            //Pick all index onwards keyframes
                            keyframesNew = traj2.es.keyframes.slice(index);

                            var targetKF;
                            if (index >= 1) {
                                // There is a prevKF available
                                var prevKF = traj2.es.keyframes[index - 1];
                                // Decide what view to target from the current view and how long we should take to get to the target view
                                targetKF = self._tryGoToPreviousKeyframe(currentKF, prevKF, nextKf, traj2, t2) ||
                                    self._tryGoToIntermediateKeyframe(currentKF, prevKF, nextKf, traj2, t2);
                            }
                            else {
                                // There is no keyframe before t2, we will head to nextKF directly
                                targetKF = null;
                            }

                            if (targetKF) {
                                keyframesNew.unshift(currentKF, targetKF);
                            }
                            else {
                                keyframesNew.unshift(currentKF);
                            }
                        }

                        
/*                            // We will insert (possibly) two keyframes at the beginning of keyframesNew : 
                            // first one will be currentKF, second one will be added with adaptive offset and view = view of keyframesNew[0]

                            //calculate the adaptive duration
                            var adaptiveDurationInSec = 6;
                            if (typeof (self.calculateAdaptiveDuration) == "function") {
                                var calculatedAdaptiveDuration = self.calculateAdaptiveDuration(currentKF, keyframesNew[0], traj2.es);
                                if ( calculatedAdaptiveDuration >= 0) {
                                    //got back a valid value
                                    adaptiveDurationInSec = calculatedAdaptiveDuration; 
                                }
                            }

                            // Check if secondKF will bump into traj2.es.keyframesNew[0], if so, don't add secondKF
                            var HOLD_DURATION = 0.1; //we will add a small holdduration on secondKF to get the easing effect
                            var secondKFOffset = t2 + adaptiveDurationInSec;
                            if ((secondKFOffset + HOLD_DURATION > keyframesNew[0].offset) /* gone beyond the next keyframe * ||
                                Math.abs(secondKFOffset + HOLD_DURATION - keyframesNew[0].offset) < 0.1 /*very close *) {
                                // we will not add second keyframe
                                keyframesNew.unshift(currentKF);
                            }
                            else {
                                secondAdaptiveKF = rin.util.deepCopy(keyframesNew[0]);
                                secondAdaptiveKF.offset = secondKFOffset;                          
                                secondAdaptiveKF.holdDuration = HOLD_DURATION;
                                keyframesNew.unshift(currentKF, secondAdaptiveKF);
                            }
                    } 
                    */
                        var esAdaptive = {
                            duration: traj2.duration,
                            keyframes: keyframesNew
                        };

                        //EARLY RETURN!!
                        return trajectoryBuilder.buildTrajectoryFromExperienceStream(esAdaptive);
                    }
                        
                    var preKf = null;
                    var prePreKf = null;
                    var postKf = null;
                    var postPostKf = null;
                    var DELTA = 1.0;
                    var TRANSITION_TIME = 2.0;
                    var keyframes = [];

                    if (!traj1) {
                        preKf = self.captureKeyframe();
                    } else {
                        if (traj1.sampleAt) {
                            prePreKf = traj1.sampleAt(t1 - DELTA);
                            preKf = traj1.sampleAt(t1);
                            preKf.holdDuration = 0;
                        }
                    }
                    if (prePreKf) {
                        prePreKf.offset = t2 - DELTA;
                        if (prePreKf.offset < 0) {
                            prePreKf = null;
                        } else {
                            keyframes.push(prePreKf);
                        }
                    }
                    if (preKf) {
                        preKf.offset = t2;
                        keyframes.push(preKf);
                    }
                    if (traj2.sampleAt) {
                        if (pause) {
                            postKf = traj2.sampleAt(t2);
                        } else {
                            postKf = traj2.sampleAt(t2 + TRANSITION_TIME);
                            postPostKf = traj2.sampleAt(t2 + TRANSITION_TIME + DELTA);
                        }
                        if (postKf) {
                            postKf.offset = t2 + TRANSITION_TIME;
                            keyframes.push(postKf);
                        }
                        if (postPostKf) {
                            postPostKf.offset = t2 + TRANSITION_TIME + DELTA;
                            keyframes.push(postPostKf);
                        }
                    }
                    var resultTrajectory;
                    // TODO: resolve issues with pause case
                    // We will generate the transienttrajectory only if play was called and the view is not the default one
                    if (preKf && postKf && !pause && self._playCalled) {
                        //
                        // Construct an on-the-fly ES and build a transition trajectory out of that ES
                        //
                        var es = {
                            duration: TRANSITION_TIME,
                            keyframes: keyframes
                        };

                        var useAdaptiveDuration = (traj2.es && traj2.es.transitionType && traj2.es.transitionType == "adaptiveFirstDuration"); // we want to use adaptive/variable time to get to the second keyframe of the traj2

                        var buildNewTraj2 = (t2 < 1.0E-5 && traj2.es && traj2.es.keyframes && traj2.es.keyframes.length > 0);
                            

                        if (buildNewTraj2) {

                            // We're very close to the start of Traj2 AND Traj2 is based on an experience stream with nonzero keyframes! Copy the keyframe array, and replace the first.
                             
                            var keyframesCopy = traj2.es.keyframes.slice(0);
                            //We expect to have atleast 2 keyframes in the adaptiveFirstDuration case
                            rin.internal.debug.assert(!useAdaptiveDuration || (useAdaptiveDuration && keyframesCopy.length >= 2));

                            if (keyframesCopy.length == 1) {
                                // We turn a 1 keyframe path to a 2 keyframe path
                                postKf = traj2.sampleAt(traj2.duration);
                                postKf.offset = traj2.duration;
                                keyframesCopy = [preKf, postKf];
                            } else {
                                // We replace the first keyframe with the current state.
                                keyframesCopy[0] = preKf;
                                if (useAdaptiveDuration)
                                {
                                    //TODO: we should construct the first two keyframes from the first keyframe programmatically
                                    //delegate to the ES to do this calculation if possible
                                    if (typeof (self.calculateAdaptiveOffset) == "function") {
                                        var tmp = rin.util.deepCopy(keyframesCopy[1]);
                                        var adaptiveOffset = self.calculateAdaptiveOffset(keyframesCopy[0], tmp, traj2.es);
                                        //TODO: need to make sure the second keyframe doesn't bump into next keyframes or goes beyond the duration of the es
                                        tmp.offset = adaptiveOffset;
                                        //set the holdDuration on the second keyframe to be a non-zero value if not already so
                                        if (!tmp.holdDuration || tmp.holdDuration == 0)
                                            tmp.holdDuration = 1;
                                        keyframesCopy[1] = tmp;
                                    }
                                }
                            } 
                            es.keyframes = keyframesCopy;
                            es.duration = traj2.duration;
                        }
                        
                        var transitionTraj = trajectoryBuilder.buildTrajectoryFromExperienceStream(es);

                        if (buildNewTraj2) {
                            resultTrajectory = transitionTraj;
                        }
                        else {
                            resultTrajectory = {
                                renderAt: function (time) {
                                    if (time < t2 + TRANSITION_TIME) {
                                        transitionTraj.renderAt(time);
                                    } else {
                                        if (pause) {
                                            time = t2;
                                        }
                                        traj2.renderAt(time);
                                    }
                                },
                                sampleAt: (traj2.sampleAt) ? function (time, kf) {
                                    if (time < t2 + TRANSITION_TIME) {
                                        return transitionTraj.sampleAt(time);
                                    } else {
                                        if (pause) {
                                            time = t2;
                                        }
                                        return traj2.sampleAt(time);
                                    }
                                } : null,
                                duration: pause ? TRANSITION_TIME : traj2.duration
                            };
                        }                        
                    } else {
                        resultTrajectory = traj2;
                        if (pause) {
                            //
                            // We do an instant pause (no slow pause for now).
                            // So, create a new trajectory of duration 0, and map render for any time to rendering the underlying
                            // trajectory (activeTrajectory) at the (unchanging) pause time (t2)
                            //
                            resultTrajectory = {
                                renderAt: function (time) {
                                    traj2.renderAt(t2);
                                },
                                sampleAt: (traj2.sampleAt) ? function (time, kf) {
                                    return traj2.sampleAt(t2, kf);
                                } : null,
                                duration: 0
                            };
                        }
                        else {
                            // Play is called. remember it.
                            self._playCalled = true;
                        }
                    }
                    return resultTrajectory;
                };
            }
            self._trajectoryBuilder = trajectoryBuilder;
            self._interpolationStoryBoard = rin.Ext.NonLinearStoryboard.buildStoryboard(trajectoryBuilder.storyboardHelper);
        }

        self._currentStreamTrajectory = trajectoryBuilder.buildTrajectoryFromExperienceStreamId(experienceStreamId);
    },

    //Minimum hold duration that will be added to the intermediate keyframe added for smooth resume transition
    _MIN_HOLDDURATION : 0.2,
    // Minimum duration needed to do a proper transition from intermediate keyframe to the nextKeframe in a smooth resume transition
    _MIN_TRANSITION_TO_NEXTKF: 6,

    //Typical transition time to get to the intermediate  added for smooth resume transition
    _TRANSITION_TIME: 3,
    // Check if we can go to prevKF within reasonable time given the resume offset = t2, return the target keyframe to be inserted
    // else return null
    _tryGoToPreviousKeyframe: function(currentKF, prevKF, nextKf, traj2, t2){
        var self = this;
        var targetKf = null;
        if (t2 < prevKF.offset + prevKF.holdDuration) {
            // t2 is within the holdDuration of the prevKF. Try to attach to prevKF 
            var adaptiveDurationInSec = self._TRANSITION_TIME; //TODO: too lenient?
            if (typeof (self.calculateAdaptiveDuration) == "function") {
                var calculatedAdaptiveDuration = self.calculateAdaptiveDuration(currentKF, prevKF, traj2.es);
                if ( calculatedAdaptiveDuration >= 0) {
                    //got back a valid value
                    adaptiveDurationInSec = calculatedAdaptiveDuration; 
                }
            }
            if (t2 + adaptiveDurationInSec + self._MIN_HOLDDURATION < prevKF.offset + prevKF.holdduration) {
                /* we have enough time to get to prevKF within its holdduration so attach to prevKF */
                targetKf = rin.util.deepCopy(prevKF);
                targetKf.offset = t2 + adaptiveDurationInSec;
                targetKf.holdDuration = prevKF.offset + prevKF.holdDuration - targetKf.offset;
            }
        }
        return targetKf;
    },
    // Check if we can go to a sampled intermediate keyframe along the trajectory that goes from prevKF to nextKF within a reasonable time given the resume offset = t2
    // return the target keyframe to be inserted else return null
    _tryGoToIntermediateKeyframe: function(currentKF, prevKF, nextKf, traj2, t2) {
        if (typeof (traj2.sampleAt) != "function" ) {
            // EARLY RETURN
            return null;
        }

        // We sample at ESTIMATED transition time, because the actual transition time is only known once we have the sample!
        var self = this;
        var targetKf = null;
        targetKf = traj2.sampleAt(t2 + self._TRANSITION_TIME);
        if (targetKf == null)
            return null;
        
        var adaptiveDurationInSec = self._TRANSITION_TIME; 
        if (typeof (self.calculateAdaptiveDuration) == "function") {
            var calculatedAdaptiveDuration = self.calculateAdaptiveDuration(currentKF, targetKf, traj2.es);
            if ( calculatedAdaptiveDuration >= 0) {
                //got back a valid value
                adaptiveDurationInSec = calculatedAdaptiveDuration; 
            }
        }
        if (t2 + adaptiveDurationInSec + self._MIN_HOLDDURATION + self._MIN_TRANSITION_TO_NEXTKF < nextKf.offset) {
            // we have enough time for it to be worthwhile getting to sampled point and then from there to nextKF 
            targetKf.offset = t2 + adaptiveDurationInSec;
            targetKf.holdDuration = self._MIN_HOLDDURATION;
        }
        return targetKf;
    },

    // Check if the experienceStreamId is valid.
    _getExperienceStreamFromId: function (experienceStreamId) {
        return this._esData.experienceStreams[experienceStreamId];
    },

    // Seek to the specified offset.
    _updateActiveES: function (offset, experienceStreamId) {
        var isUpdated = false;
        if (experienceStreamId != this._currentExperienceStreamId && this._getExperienceStreamFromId(experienceStreamId)) {
            this.resetUserInterface();
            this._initKeyframes(experienceStreamId);
            this._currentExperienceStreamId= experienceStreamId;
            isUpdated = true;
        }

        return isUpdated;
    },

    _sliverInterpolators: {},
    _currentExperienceStreamId: null,
    _currentStreamTrajectory: null,
    _interpolationStoryBoard : null,
    _trajectoryBuilder: null,
    _userInterfaceControl: null,
    _orchestrator: null,
    _playCalled: false,
    _esData: null
};
var rin;
(function (rin) {
    (function (Ext) {
        /// <reference path="rintypes.d.ts"/>
        //
        // RIN Trajectory implementation (part of Nonlinear Storyboard functionality)
        //
        // NOTE: THIS CODE IS GENERATED FROM trajectory.ts using the TypeScript compiler.
        // MAKE SURE THAT CHANGES ARE REFLECTED IN THE .TS FILE!
        //
        // Copyright (C) 2013 Microsoft Research
        //
        (function (Interpolators) {
            // Class to interpolate a viewport.
            var linearViewportInterpolator = (function () {
                function linearViewportInterpolator(iState) {
                    this.sliverId = "viewport";
                    this.iState = iState;
                }
                linearViewportInterpolator.prototype.interpolate = function (time, kf) {
                    if(!kf) {
                        return null;
                    }
                    var kfState = kf.state[this.sliverId];
                    if(this.iState.postKf && this.iState.preKf) {
                        var postKfState = this.iState.postKf.state[this.sliverId];
                        var preKfState = this.iState.preKf.state[this.sliverId];
                        var d = this.iState.postKf.offset - this.iState.preKf.offset;
                        var t = time - this.iState.preKf.offset;
                        function doubleInterpolate(pre, post) {
                            return (post - pre) * t / d + pre;
                        }
                        kfState.region.center.x = doubleInterpolate(preKfState.region.center.x, postKfState.region.center.x);
                        kfState.region.center.y = doubleInterpolate(preKfState.region.center.y, postKfState.region.center.y);
                        kfState.region.span.x = doubleInterpolate(preKfState.region.span.x, postKfState.region.span.x);
                        kfState.region.span.y = doubleInterpolate(preKfState.region.span.y, postKfState.region.span.y);
                        if(postKfState.rotation && preKfState.rotation) {
                            kfState.rotation = doubleInterpolate(preKfState.rotation, postKfState.rotation);
                        }
                    } else {
                        var preOrPostKf = this.iState.preKf || this.iState.postKf;
                        var preOrPostkfState = preOrPostKf.state[this.sliverId];
                        kfState.region.center.x = preOrPostkfState.region.center.x;
                        kfState.region.center.y = preOrPostkfState.region.center.y;
                        kfState.region.span.x = preOrPostkfState.region.span.x;
                        kfState.region.span.y = preOrPostkfState.region.span.y;
                        kfState.rotation = preOrPostkfState.rotation;
                    }
                    return kf;
                };
                return linearViewportInterpolator;
            })();
            Interpolators.linearViewportInterpolator = linearViewportInterpolator;            
            // Class to interpolate a double valued sliver on a linear path.
            var linearDoubleInterpolator = (function () {
                function linearDoubleInterpolator(sliverId, iState) {
                    this.sliverId = sliverId;
                    this.sliverId = sliverId;
                    this.iState = iState;
                }
                linearDoubleInterpolator.prototype.interpolate = function (time, kf) {
                    if(!kf) {
                        return null;
                    }
                    if(this.iState.postKf && this.iState.preKf) {
                        var postKfState = this.iState.postKf.state[this.sliverId];
                        var preKfState = this.iState.preKf.state[this.sliverId];
                        // Both preKf and postKf are present, interpolate the value.
                        var c = postKfState - preKfState;
                        var t = time - this.iState.preKf.offset;
                        var b = preKfState;
                        var d = this.iState.postKf.offset - this.iState.preKf.offset;
                        var val = c * t / d + b;
                        kf.state[this.sliverId] = val;
                    } else {
                        var preOrPostKf = this.iState.preKf || this.iState.postKf;
                        kf.state[this.sliverId] = preOrPostKf.state[this.sliverId];
                    }
                    return kf;
                };
                return linearDoubleInterpolator;
            })();
            Interpolators.linearDoubleInterpolator = linearDoubleInterpolator;            
            // Class to choose previous keyframe sliver when no interpolator is available.
            var discreteInterpolator = (function () {
                function discreteInterpolator(sliverId, iState) {
                    this.sliverId = sliverId;
                    this.sliverId = sliverId;
                    this.iState = iState;
                }
                discreteInterpolator.prototype.interpolate = function (time, kf) {
                    if(kf && this.iState.preKf) {
                        kf.state[this.sliverId] = this.iState.preKf.state[this.sliverId];
                    }
                    return kf;
                };
                return discreteInterpolator;
            })();
            Interpolators.discreteInterpolator = discreteInterpolator;            
        })(Ext.Interpolators || (Ext.Interpolators = {}));
        var Interpolators = Ext.Interpolators;
    })(rin.Ext || (rin.Ext = {}));
    var Ext = rin.Ext;
})(rin || (rin = {}));
//@ sourceMappingURL=BasicInterpolators.js.map

var rin;
(function (rin) {
    (function (Ext) {
        /// <reference path="rintypes.d.ts"/>
        //
        // Nonlinear Storyboard implementation.
        //
        // NOTE: THIS CODE IS GENERATED FROM nonLinearStoryboard.ts using the TypeScript compiler.
        // MAKE SURE THAT CHANGES ARE REFLECTED IN THE .TS FILE!
        //
        // Copyright (C) 2013 Microsoft Research
        //
        (function (NonLinearStoryboard) {
            var STOPPED = 0, PLAYING = 1, PAUSING = 2, PAUSED = 3;
            // state values;
                        function log(str) {
                console.log(str);
            }
            ;
            function buildStoryboard(sb) {
                var state = STOPPED;
                var startAbsoluteTime = 0;
                var startOffset = 0;
                var activeTraj = null;
                function renderAt(time) {
                    var offset = 0;
                    var callStop = false;
                    ;
                    if(state === STOPPED) {
                        //log("Ignoring because state is STOPPED");
                        return;
                    }
                    offset = startOffset + (time - startAbsoluteTime);
                    if(offset < 0) {
                        //log("Ignoring because offset<0");
                        return;
                    }
                    if(offset > activeTraj.duration) {
                        //log("Past duration; stopping...");
                        offset = activeTraj.duration;
                        callStop = true;
                    }
                    activeTraj.renderAt(offset)// We render once even if passed the time, to ensure the end state is actually rendered.
                    ;
                    if(callStop) {
                        stop();
                    }
                }
                function getFrameAt(offset, traj) {
                    if(offset > traj.duration) {
                        offset = traj.duration;
                    }
                    return traj.sampleAt(offset);
                }
                function stop() {
                    //log("STOP!");
                    state = STOPPED;
                    activeTraj = null;
                    startOffset = 0;
                    startAbsoluteTime = 0;
                    sb.stopAnimation()// call back to stop animation.
                    ;
                }
                function playPause(traj, offset, pause/*, completionCallback() */ ) {
                    var ct = sb.getCurrentTime();
                    var activeTrajOffset = 0;
                    if(activeTraj != null) {
                        activeTrajOffset = startOffset + (ct - startAbsoluteTime);
                    }
                    startAbsoluteTime = ct;
                    startOffset = offset;
                    activeTraj = sb.buildTransitionTrajectory(activeTraj, activeTrajOffset, traj, offset, pause);
                    activeTraj.targetExperienceStreamId = traj.targetExperienceStreamId;
                    sb.startAnimation()// callback to start animation (even if pausing; once transition trajectory is done stop() will be executed)
                    ;
                }
                return {
                    play: function (traj, offset) {
                        //log("PLAY!");
                        state = PLAYING;
                        playPause(traj, offset, false);
                    },
                    pause: function (traj, offset) {
                        //log("PAUSE!");
                        state = PAUSING;
                        playPause(traj, offset, true);
                    },
                    renderAt: renderAt,
                    getFrameAt: getFrameAt,
                    render: function () {
                        renderAt(sb.getCurrentTime());
                    },
                    stop: stop
                };
            }
            NonLinearStoryboard.buildStoryboard = buildStoryboard;
        })(Ext.NonLinearStoryboard || (Ext.NonLinearStoryboard = {}));
        var NonLinearStoryboard = Ext.NonLinearStoryboard;
    })(rin.Ext || (rin.Ext = {}));
    var Ext = rin.Ext;
})(rin || (rin = {}));
//@ sourceMappingURL=nonLinearStoryboard.js.map

var rin;
(function (rin) {
    (function (Ext) {
        /// <reference path="rintypes.d.ts"/>
        /// <reference path="BasicInterpolators.ts"/>
        //
        // RIN Trajectory implementation (part of Nonlinear Storyboard functionality)
        //
        // NOTE: THIS CODE IS GENERATED FROM trajectory.ts using the TypeScript compiler.
        // MAKE SURE THAT CHANGES ARE REFLECTED IN THE .TS FILE!
        //
        // Copyright (C) 2013 Microsoft Research
        //
        (function (Trajectory) {
            function log(str) {
                console.log(str);
            }
            ;
            // (stolen from rin.core)
            // Deep copy the object. Only members are copied and so the resulting object will not be of the same type.
            function deepCopy(obj) {
                if(typeof (obj) != "object" || obj == null) {
                    return obj;
                }
                var temp = obj.constructor();
                for(var i in obj) {
                    temp[i] = deepCopy(obj[i]);
                }
                return temp;
            }
            ;
            var BaseTrajectory = (function () {
                function BaseTrajectory(duration) {
                    this.duration = duration;
                }
                BaseTrajectory.prototype.renderAt = function (time) {
                    log("EMPTY RENDER AT");
                };
                BaseTrajectory.prototype.sampleAt = function (time, kf) {
                    log("EMPTY SAMPLE AT");
                    return null;
                };
                return BaseTrajectory;
            })();            
            function newTrajectoryBuilder(e) {
                var e = e;
                var date = new Date();
                //
                // Any of the returned object's fields can be overridden with Experience provider specific code. The interpolateSliver function should call the base
                // implementation for default handling of slivers.
                //
                return {
                    keyframeInterpolatorPre: function (iState) {
                        return null;
                    },
                    sliverInterpolator: function (sliverId, state) {
                        return null;
                    },
                    keyframeInterpolatorPost: function (state) {
                        return null;
                    },
                    renderKeyframe: function (kf) {
                    },
                    storyboardHelper: {
                        buildTransitionTrajectory: function (traj1, t1, activeTrajectory, t2, pause) {
                            // TODO When implementing smooth transitions, if traj1 is null we have to call to the environment to get the current state.
                            var resultTrajectory = activeTrajectory;
                            if(pause) {
                                //
                                // We do an instant pause (no slow pause for now).
                                // So, create a new trajectory of duration 0, and map render for any time to rendering the underlying
                                // trajectory (activeTrajectory) at the (unchanging) pause time (t2)
                                //
                                resultTrajectory = new BaseTrajectory(0);
                                resultTrajectory.renderAt = function (time) {
                                    activeTrajectory.renderAt(t2);
                                };
                                resultTrajectory.sampleAt = (activeTrajectory.sampleAt) ? function (time, kf) {
                                    return activeTrajectory.sampleAt(t2, kf);
                                } : null;
                            }
                            ;
                            return resultTrajectory;
                        },
                        getCurrentTime: function () {
                            return Date.now() / 1000;
                        },
                        startAnimation: //
                        // A notification to the calling environment to START animation - i.e., begin repeatedly calling render().
                        // NOTE: The implementation should be idempotent, i.e., deal with being called multiple times without an intervening stopAnimation().
                        //
                        function () {
                            log("START ANIMATION");
                        },
                        stopAnimation: //
                        // A notification to the calling environment to STOP animation - i.e., stop repeatedly calling render().
                        // NOTE: The implementation should be idempotent, i.e., deal with being called multiple times without an intervening startAnimation().
                        //
                        function () {
                            log("STOP ANIMATION");
                        }
                    },
                    buildTrajectoryFromExperienceStreamId: function (esId) {
                        var es = e.experienceStreams[esId];
                        var retTraj = this.buildTrajectoryFromExperienceStream(es);
                        retTraj.targetExperienceStreamId = esId;
                        return retTraj;
                    },
                    buildTrajectoryFromExperienceStream: function (es) {
                        var traj = new BaseTrajectory(es.duration);
                        var tb = this;
                        var workingKf0;
                        var kfState = {
                            es: es
                        };
                        var sliverIds = buildSliverIdsForES(es);
                        var sliverStates = [];
                        var prepareKeyframeInterpolator = null;
                        var sliverInterpolators = {
                        };
                        var finalizeKeyframeInterpolator = null;
                        if(e.data.defaultKeyframe) {
                            // deep copy
                            workingKf0 = deepCopy(e.data.defaultKeyframe);
                        } else {
                            workingKf0 = {
                                offset: 0,
                                holdDuration: 0,
                                data: null,
                                state: null
                            };
                        }
                        traj.sampleAt = function (time, workingKf) {
                            if(time < 0) {
                                time = 0;
                            }
                            if(!es.keyframes || es.keyframes.length === 0) {
                                // no keyframes.
                                return null;
                            }
                            if(!workingKf) {
                                if(e.data.defaultKeyframe) {
                                    // deep copy
                                    workingKf = deepCopy(e.data.defaultKeyframe);
                                } else {
                                    workingKf = {
                                        offset: 0,
                                        holdDuration: 0,
                                        data: null,
                                        state: null
                                    };
                                }
                            }
                            workingKf.offset = time;
                            //
                            // Initialize/Update the interpolation states, which may get rebuilt each time we cross a keyframe.
                            //
                            var reCompute = false;
                            if(updateKeyframeInterpolationState(tb, es, kfState, time)) {
                                reCompute = true;
                            }
                            if(reCompute) {
                                //
                                // We need to recompute all the interpolation functions...
                                //
                                prepareKeyframeInterpolator = tb.keyframeInterpolatorPre(kfState);
                                // For each sliver in sliverIds, we create an array of keyframes that have that sliver, and then call updateKeyframeInteroplationState1 to update that sliver's Interpolation state.
                                sliverInterpolators = {
                                };
                                sliverIds.forEach(function (sliverId) {
                                    if(reCompute) {
                                        var sliverKeyframes = es.keyframes.filter(function (kf) {
                                            return (kf.state && kf.state[sliverId] !== undefined);
                                        });
                                        var kfState = sliverStates[sliverId] || {
                                        };
                                        updateKeyframeInterpolationState1(tb, es, sliverKeyframes, kfState, time);
                                        sliverInterpolators[sliverId] = tb.sliverInterpolator(sliverId, kfState) || new rin.Ext.Interpolators.discreteInterpolator(sliverId, kfState);
                                    }
                                });
                                finalizeKeyframeInterpolator = tb.keyframeInterpolatorPost(kfState);
                            }
                            if(prepareKeyframeInterpolator) {
                                prepareKeyframeInterpolator.interpolate(time, workingKf);
                            }
                            sliverIds.forEach(function (sliverId) {
                                if(sliverInterpolators[sliverId]) {
                                    sliverInterpolators[sliverId].interpolate(time, workingKf);
                                }
                            });
                            if(finalizeKeyframeInterpolator) {
                                finalizeKeyframeInterpolator.interpolate(time, workingKf);
                            }
                            return workingKf;
                        };
                        traj.renderAt = function (time) {
                            traj.sampleAt(time, workingKf0);
                            if(workingKf0) {
                                tb.renderKeyframe(workingKf0);
                            }
                        };
                        // TODO: make es an optional property of traj. For now we bypass type checking.
                        var trajEx = traj;
                        trajEx.es = es;
                        return traj;
                    }
                };
            }
            Trajectory.newTrajectoryBuilder = newTrajectoryBuilder;
            //
            // Build a list of all slivers that occur in any keyframe in this Experience Stream
            //
            function buildSliverIdsForES(es) {
                var ids = {
                };
                // Build a dictionary of any slivers we find...
                es.keyframes.forEach(function (kf) {
                    var state = (kf && kf.state) || {
                    };
                    var sliverId;
                    for(sliverId in state) {
                        if(ids[sliverId] === undefined) {
                            ids[sliverId] = sliverId;
                        }
                    }
                });
                return getObjectProperties(ids, function (obj) {
                    return typeof obj === "string";
                });
            }
            function updateKeyframeInterpolationState(tb, es, kfState, time) {
                return updateKeyframeInterpolationState1(tb, es, es.keyframes, kfState, time);
            }
            function updateSliverInterpolationStates(tb, es, sliverIds, sliverStates, time) {
                // For each sliver in sliverIds, we create an array of keyframes that have that sliver, and then call updateKeyframeInteroplationState1 to update that sliver's Interpolation state.
                sliverIds.forEach(function (sliverId) {
                    var sliverKeyframes = es.keyframes.filter(function (kf) {
                        return (kf.state && kf.state[sliverId] !== undefined);
                    });
                    var kfState = sliverStates[sliverId] || {
                    };
                    sliverStates[sliverId] = updateKeyframeInterpolationState1(tb, es, sliverKeyframes, kfState, time);
                });
                return sliverStates;
            }
            //
            // Updates the interpolation state for the specified keyframes (which could be a subset of keyframe in es.keyframes)
            //
            function updateKeyframeInterpolationState1(tb, es, keyframes, kfState, time) {
                //var timeDelta: number;
                if(!kfState.es) {
                    // Init the working Keyframe...
                    kfState.es = es;
                    kfState.time = NaN;
                    kfState.preKf = kfState.prePreKf = kfState.postKf = kfState.postPostKf = null;
                }
                if(!keyframes || keyframes.length === 0) {
                    // no keyframes.
                    return false;
                }
                // Check if kfState has to be updated. If not, return false to continue using the last interpolation function.
                if((kfState.preKf && kfState.postKf && kfState.preKf.offset <= time && kfState.postKf.offset >= time) || (kfState.preKf && !kfState.postKf && kfState.preKf.offset <= time) || (kfState.postKf && !kfState.preKf && kfState.postKf.offset >= time)) {
                    return false;
                }
                //timeDelta = time-kfState.time; // could be NaN
                //if (timeDelta >= 0) {
                //    // sometime in the future...
                //    if (kfState.postKf && (timeDelta <= kfState.postKf.offset)) {
                //        // we're still behind postKf
                //        kfState.time = time;
                //        return false;
                //    }
                //} else if (timeDelta < 0) {
                //    // sometime in the past ...
                //    if (kfState.preKf && (timeDelta >= kfState.preKf.offset)) {
                //        // we're still ahead of preKf
                //        kfState.time = time;
                //        return false;
                //    }
                //}
                // We must re-compute the InterpolationState from scratch...
                kfState.time = time;
                kfState.prePreKf = kfState.postKf = kfState.postPostKf = null;
                var pre = NaN, post = NaN;
                if(time < keyframes[0].offset) {
                    // time is before first keyframe!
                    post = 0;
                } else {
                    for(pre = 1; pre < keyframes.length; pre++) {
                        if(keyframes[pre].offset > time) {
                            break;
                        }
                    }
                    pre--// Pre is now set to the first keyframe with offset<=time;
                    ;
                    if(pre < keyframes.length - 1) {
                        post = pre + 1;
                    }
                }
                if(!isNaN(pre)) {
                    kfState.preKf = keyframes[pre];
                    if(pre > 0) {
                        kfState.prePreKf = keyframes[pre - 1];
                    }
                }
                if(!isNaN(post)) {
                    kfState.postKf = keyframes[post];
                    if(post < (keyframes.length - 1)) {
                        kfState.postPostKf = keyframes[post + 1];
                    }
                }
                return true;// true === Recompute the interpolation functions...
                
            }
            function getObjectProperties(obj, pred) {
                var props = [];
                var p;
                for(p in obj) {
                    if(pred(obj[p])) {
                        props.push(p);
                    }
                }
                return props;
            }
        })(Ext.Trajectory || (Ext.Trajectory = {}));
        var Trajectory = Ext.Trajectory;
    })(rin.Ext || (rin.Ext = {}));
    var Ext = rin.Ext;
})(rin || (rin = {}));
//@ sourceMappingURL=trajectory.js.map

var rin;
(function (rin) {
    (function (Ext) {
        /// <reference path="rintypes.d.ts"/>
        // RIN Viewport sliver interpolator - for 2D regions, applicable to panoramas. maps and deep-zoom images,
        //
        // NOTE: THIS CODE IS GENERATED FROM ViewportInterpolator2D.ts using the TypeScript compiler.
        // MAKE SURE THAT CHANGES ARE REFLECTED IN THE .TS FILE!
        //
        // Copyright (C) 2013 Microsoft Research
        //
        (function (Interpolators) {
            // Private module containing some Quaternion-specific code....
            //
            var QuaternionHelperVectorBased = (function () {
                function QuaternionHelperVectorBased(r1, r2) {
                    this.q1 = {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
                    };
                    this.q2 = {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
                    };
                    this.qOrtho = {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
                    };
                    this.q = {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
                    };
                    this.halfTheta = 0;
                    this.normalizer = 0.5;
                    this.collinear = false;
                    var sinHalfTheta;
                    var q1 = this.q1;
                    var q2 = this.q2;
                    QuaternionHelperVectorBased.centerToQuaternion(r1.center, q1);
                    QuaternionHelperVectorBased.centerToQuaternion(r2.center, q2);
                    var cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
                    if(cosHalfTheta < 0.0) {
                        // TODO. VERIFY!!!
                        cosHalfTheta = -cosHalfTheta;
                        q2.x = -q2.x;
                        q2.y = -q2.y;
                        q2.z = -q2.z;
                        q2.w = -q2.w;
                    }
                    if(cosHalfTheta > 1.0) {
                        // TODO - what strategy?
                        cosHalfTheta = 1.0;
                    }
                    if(cosHalfTheta > 0.9999) {
                        this.collinear = true;
                    } else {
                        sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
                        this.halfTheta = Math.acos(cosHalfTheta);
                        this.normalizer = 1.0 / sinHalfTheta;
                        //Compute vector orthogonal to q1
                        this.qOrtho.x = q2.x - q1.x * cosHalfTheta;
                        this.qOrtho.y = q2.y - q1.y * cosHalfTheta;
                        this.qOrtho.z = q2.z - q1.z * cosHalfTheta;
                        this.qOrtho.w = q2.w - q1.w * cosHalfTheta;
                        var length = Math.sqrt(this.qOrtho.x * this.qOrtho.x + this.qOrtho.y * this.qOrtho.y + this.qOrtho.z * this.qOrtho.z + this.qOrtho.w * this.qOrtho.w);
                        var invLength = 1.0 / length;
                        this.qOrtho.x *= invLength;
                        this.qOrtho.y *= invLength;
                        this.qOrtho.z *= invLength;
                        this.qOrtho.w *= invLength;
                    }
                }
                QuaternionHelperVectorBased.prototype.interpolateCenter = function (progress, center) {
                    var q = this.q;
                    var q1 = this.q1;
                    var q2 = this.q2;
                    var qOrtho = this.qOrtho;
                    if(this.collinear) {
                        var q1Fraction, q2Fraction;
                        q1Fraction = 1.0 - progress;
                        q2Fraction = progress;
                        q.x = q1.x * q1Fraction + q2.x * q2Fraction;
                        q.y = q1.y * q1Fraction + q2.y * q2Fraction;
                        q.z = q1.z * q1Fraction + q2.z * q2Fraction;
                        q.w = q1.w * q1Fraction + q2.w * q2Fraction;
                    } else {
                        var fractionTheta = this.halfTheta * progress;
                        var cosFractionTheta = Math.cos(fractionTheta);
                        var sinFractionTheta = Math.sqrt(1.0 - cosFractionTheta * cosFractionTheta);
                        q.x = q1.x * cosFractionTheta + qOrtho.x * sinFractionTheta;
                        q.y = q1.y * cosFractionTheta + qOrtho.y * sinFractionTheta;
                        q.z = q1.z * cosFractionTheta + qOrtho.z * sinFractionTheta;
                        q.w = q1.w * cosFractionTheta + qOrtho.w * sinFractionTheta;
                    }
                    QuaternionHelperVectorBased.quaternionToCenter(q, center);
                };
                QuaternionHelperVectorBased.centerToQuaternion = //
                // Converts the center of the viewport into a representation quaternion.
                // TODO: Deal with "tilt"/ "roll" aspect. For now, we assume zero-tilt.
                //
                function centerToQuaternion(c, q) {
                    //Using vector algebra
                    var cosPitch = Math.cos(c.y);
                    var sinPitch = Math.sin(c.y);
                    var cosHeading = Math.cos(c.x);
                    var sinHeading = Math.sin(c.x);
                    q.z = sinPitch;
                    q.x = cosPitch * sinHeading;
                    q.y = cosPitch * cosHeading;
                    q.w = 0;
                };
                QuaternionHelperVectorBased.quaternionToCenter = //
                // Computes the center of the viewport fromt its representative quaternion.
                // TODO: Deal with "tilt" or "roll" aspect. For now, we assume zero-tilt.
                //
                function quaternionToCenter(q, c) {
                    if(q.w != 0) {
                        if(typeof (console) != "undefined" && console && console.log) {
                            console.log("vectorBased interpolation: quaternions with q.w = 0?");
                        }
                    }
                    var pitch = Math.asin(q.z);
                    var heading = Math.atan2(q.x, q.y);
                    c.x = heading;
                    c.y = pitch;
                };
                return QuaternionHelperVectorBased;
            })();
            Interpolators.QuaternionHelperVectorBased = QuaternionHelperVectorBased;            
            (function (EasingOption) {
                EasingOption._map = [];
                EasingOption._map[0] = "noEasing";
                EasingOption.noEasing = 0;// fast-start and fast end => Linear all through
                
                EasingOption._map[1] = "inEasing";
                EasingOption.inEasing = 1;// slow-start and fast end => in-cubic
                
                EasingOption._map[2] = "outEasing";
                EasingOption.outEasing = 2;// fast-start and slow end => out-cubic
                
                EasingOption._map[3] = "inOutEasing";
                EasingOption.inOutEasing = 3;// slow-start and slow end => piecewise cubic-linear-cubic if the interpolation duration is long enough, else resort to in-out-cubic
                
            })(Interpolators.EasingOption || (Interpolators.EasingOption = {}));
            var EasingOption = Interpolators.EasingOption;
            // Class that is used to compute eased progress for a given interpolation state and the suggested easing duration
            var PiecewiseCubicEasingHelper = (function () {
                function PiecewiseCubicEasingHelper(iState, easingDuration, easingOption) {
                    this.linearEasing = function (t) {
                        return t;
                    };
                    this.inCubicEasing = function (t) {
                        return t * t * t;
                    };
                    this.outCubicEasing = function (t) {
                        return t * (t * (t - 3) + 3);
                    };
                    this.inOutCubicEasing = function (t) {
                        return (3 - 2 * t) * t * t;
                    };
                    this.constantEasing = function (t) {
                        // we are in the special case where preKf.offset + holdduration > postKf.offset
                        return 0;
                    };
                    this.piecewiseInOutCubicEasing = function (t) {
                        var retval = t;
                        if(t < this.inTransitionEndNormalized) {
                            //in-cubic portion
                            retval = this.constMultiplier * t * t * t;
                        } else if(t > this.outTransitionStartNormalized) {
                            //out-cubic portion
                            var OneMinust = 1.0 - t;
                            retval = 1.0 - this.constMultiplier * OneMinust * OneMinust * OneMinust;
                        } else {
                            // Linear part
                            retval = this.lineoffset + this.lineSlope * (t - this.inTransitionEndNormalized);
                        }
                        return retval;
                    };
                    //Figure out if the interpolation duration is long enough to support the easingDuration for the given easingOption
                    var holdDuration = iState.preKf.holdDuration ? iState.preKf.holdDuration : 0.0;
                    var interpolationDuration = iState.postKf.offset - iState.preKf.offset - holdDuration;
                    var MIN_INTERPOLATIONDURATION = 0.1;
                    if(interpolationDuration <= MIN_INTERPOLATIONDURATION) {
                        this.ease = this.constantEasing;
                        return;
                    }
                    switch(easingOption) {
                        case EasingOption.inOutEasing:
                            if(easingDuration < MIN_INTERPOLATIONDURATION) {
                                this.ease = this.linearEasing;
                            } else {
                                if(interpolationDuration < 2 * easingDuration) {
                                    this.ease = this.inOutCubicEasing;
                                } else {
                                    this.ease = this.piecewiseInOutCubicEasing;
                                }
                            }
                            break;
                        case EasingOption.inEasing:
                            this.ease = this.inCubicEasing;
                            break;
                        case EasingOption.outEasing:
                            this.ease = this.outCubicEasing;
                            break;
                        case EasingOption.noEasing:
                        default:
                            this.ease = this.linearEasing;
                    }
                    if(this.ease == this.piecewiseInOutCubicEasing) {
                        // set up all the needed constants
                        // Calculate normalized inTransitionStart and outTransitionEnd
                        var invDuration = 1.0 / interpolationDuration;
                        this.inTransitionEndNormalized = easingDuration * invDuration;
                        this.outTransitionStartNormalized = (interpolationDuration - easingDuration) * invDuration;
                        var inTransitionEndNormalizedSquared = this.inTransitionEndNormalized * this.inTransitionEndNormalized;
                        var inTransitionEndNormalizedCubed = inTransitionEndNormalizedSquared * this.inTransitionEndNormalized;
                        // Evaluate multiplier used in the 0 - inTransitionEndNormalized interval
                        // it will be > 0 for all 0 < inTransitionEndNormalized < 0.75 with a max at 0.5
                        this.constMultiplier = 1.0 / (3 * inTransitionEndNormalizedSquared - 4 * inTransitionEndNormalizedCubed);
                        //Calculate the slope of the linear piece that used in the interval from inTransitionEndNormalized to outTransitionStartNormalized
                        this.lineSlope = (1.0 - 2 * this.constMultiplier * inTransitionEndNormalizedCubed) / (1 - 2 * this.inTransitionEndNormalized);
                        //Calculate the y-value of the line at inTransitionEndNormalized
                        this.lineoffset = this.constMultiplier * inTransitionEndNormalizedCubed;
                    }
                }
                return PiecewiseCubicEasingHelper;
            })();            
            // Class to interpolate a viewport using various nonlinear techniques applicable to curved 2D manifolds such as maps and panoramas.
            var viewportInterpolator2D = (function () {
                function viewportInterpolator2D(iState, type, easing) {
                    this.sliverId = "viewport";
                    // will be overwridden with data-dependent implementations.
                    this.interpolatorType = "vectorBased";
                    this.easingHelper = null;
                    this.usePiecewiseCubicEasing = true;
                    this.defaultEasingDuation = 2.0;
                    var postKfState = iState.postKf ? iState.postKf.state[this.sliverId] : null;
                    var preKfState = iState.preKf ? iState.preKf.state[this.sliverId] : null;
                    ;
                    if(type) {
                        this.interpolatorType = type;
                    }
                    //
                    // Get corner cases out of the way - like single keyfame.
                    //
                    if(!(iState.postKf && iState.preKf)) {
                        var preOrPostKf = iState.preKf || iState.postKf;
                        var preOrPostkfState = preOrPostKf.state[this.sliverId];
                        this.interpolateRegion = function (t, region) {
                            region.center.x = preOrPostkfState.region.center.x;
                            region.center.y = preOrPostkfState.region.center.y;
                            region.span.x = preOrPostkfState.region.span.x;
                            region.span.y = preOrPostkfState.region.span.y;
                            //TODO: region.rotation = preOrPostkfState.rotation;
                                                    };
                        return;// EARLY RETURN!!!
                        
                    }
                    var holdDuration = iState.preKf.holdDuration ? iState.preKf.holdDuration : 0.0;
                    var preKfRegion = preKfState.region;
                    var postKfRegion = postKfState.region;
                    var preSpanX = preKfRegion.span.x;
                    var preSpanY = preKfRegion.span.y;
                    var postSpanX = postKfRegion.span.x;
                    var postSpanY = postKfRegion.span.y;
                    var preTime = iState.preKf.offset + holdDuration;
                    var timeDelta = iState.postKf.offset - preTime;
                    var MIN_INTERPOLATIONDURATION = 0.1;
                    if(timeDelta < MIN_INTERPOLATIONDURATION) {
                        timeDelta = 0.0;
                    }
                    //
                    // Setup the source and destination interpolating quaternions...
                    //
                    var qh;
                    var easingHelper;
                    switch(this.interpolatorType) {
                        case "vectorBased":
                            qh = new QuaternionHelperVectorBased(preKfRegion, postKfRegion);
                            if(this.usePiecewiseCubicEasing) {
                                var easingOption = EasingOption.noEasing;
                                //Figure out the easingoption, based on whether prepre and postPost keyframes are present,  and whether they have any holdduration specified
                                // We want easing coming in if there is no prePreKf or there is some non-zero holdduration defined on preKf
                                var easingOnIn = (iState.preKf.holdDuration != undefined && iState.preKf.holdDuration > 1E-5) || !iState.prePreKf;
                                // We want easing going out if there is no postPostKf or there is some non-zero holdduration defined on postKf
                                var easingOnOut = (iState.postKf.holdDuration != undefined && iState.postKf.holdDuration > 1E-5) || !iState.postPostKf;
                                if(easingOnIn) {
                                    if(easingOnOut) {
                                        easingOption = EasingOption.inOutEasing;
                                    } else {
                                        easingOption = EasingOption.inEasing;
                                    }
                                } else {
                                    if(easingOnOut) {
                                        easingOption = EasingOption.outEasing;
                                    } else {
                                        easingOption = EasingOption.noEasing;
                                    }
                                }
                                easingHelper = new PiecewiseCubicEasingHelper(iState, iState.preKf.easingDuration ? iState.preKf.easingDuration : this.defaultEasingDuation, easingOption);
                            }
                            break;
                    }
                    //
                    //  Computes the relative progress ([0.0->1.0]) of the zoom animation. Needs to account for
                    //  easing and any special pseudo-physics that emulate "good" camera zoom motion. Note that zoom progress
                    //  is distinct from orientation progress (which captures what is at the center of the viewport).
                    //  This allows certain control over pan-relative-to-zoom.
                    //
                    var zoomProgress = function (t) {
                        // TODO: Add easing and possibly power law - see SL code base - function InterpolateKeyframes in file TFS SL sources RIN\src\SLPlayer\InterpolationLibrary\ViewAnimation:
                        // (but also note comment about about adjusting progress relative to orientation animation)
                        /*
                        double easedProgress = Ease(progress);
                        View? previousPreviousView = null;
                        View previousView = previousKeyframe.View;
                        View nextView = nextKeyframe.View;
                        View? nextNextView = null;
                        
                        // See if we are using an intermediate keyframe between the two given keyframes.
                        InternalKeyframe intermediateKeyframe = nextKeyframe.IntermediateKeyframe;
                        if (intermediateKeyframe != null)
                        {
                        double fraction = intermediateKeyframe.Offset;
                        double easedFraction = Ease(fraction);
                        if (progress <= fraction)
                        {
                        // We're between the first keyframe and the intermediate keyframe.
                        easedProgress = easedProgress / easedFraction;
                        nextNextView = nextView;
                        nextView = intermediateKeyframe.View;
                        }
                        else
                        {
                        // We're between the intermediate keyframe and the second keyframe.
                        easedProgress = (easedProgress - easedFraction) / (1 - easedFraction);
                        previousPreviousView = previousView;
                        previousView = intermediateKeyframe.View;
                        }
                        }
                        
                        // Calculate the actual progress using a power function if the zoom changes by more than half a level.
                        double finalProgress = easedProgress;
                        double zoomFactor = previousView.Zoom / nextView.Zoom;
                        if (Math.Abs(Math.Log(zoomFactor, 2)) > 0.5)
                        {
                        finalProgress = (Math.Pow(zoomFactor, easedProgress) - 1) / (zoomFactor - 1);
                        }
                        */
                        if(t < preTime || timeDelta < MIN_INTERPOLATIONDURATION) {
                            // t is in the holdDuration, return the preKf's offset
                            return 0;
                        } else {
                            var rawProgress = (t - preTime) / timeDelta;
                            return easingHelper ? easingHelper.ease(rawProgress) : Ease(rawProgress);
                        }
                    };
                    var Ease = function (t) {
                        return (3 - 2 * t) * t * t;
                    };
                    //
                    //  Computes the relative progress ([0.0->1.0]) of the orientation animation. Needs to account for
                    //  easing and any special pseudo-physics that emulate "good" camera rotation motion. Note that zoom progress
                    //  is distinct from orientation progress (which captures what is at the center of the viewport).
                    //  This allows certain control over pan-relative-to-zoom.
                    //
                    var orientationProgress = function (t) {
                        // TODO: see above implementation notes or zoomProgress
                        if(t < preTime || timeDelta < MIN_INTERPOLATIONDURATION) {
                            // t is in the holdDuration, return the preKf's offset
                            return 0;
                        } else {
                            var rawProgress = (t - preTime) / timeDelta;
                            return easingHelper ? easingHelper.ease(rawProgress) : Ease(rawProgress);
                        }
                    };
                    this.interpolateRegion = function (t, region) {
                        //
                        // Interpolate "Zoom"
                        //
                        var zp = zoomProgress(t);
                        region.span.x = preSpanX * (1 - zp) + postSpanX * zp;
                        region.span.y = preSpanY * (1 - zp) + postSpanY * zp;
                        //
                        // Interpolate "Orientation"
                        //
                        var op = orientationProgress(t);
                        qh.interpolateCenter(op, region.center);
                    };
                }
                viewportInterpolator2D.prototype.interpolateRegion = // private iState: InterpolationState;
                function (t, region) {
                };
                viewportInterpolator2D.prototype.interpolate = function (time, kf) {
                    if(!kf) {
                        return null;
                    }
                    var kfState = kf.state[this.sliverId];
                    this.interpolateRegion(time, kfState.region);
                };
                viewportInterpolator2D.prototype.interpolateRegion = function (t, region) {
                };
                return viewportInterpolator2D;
            })();
            Interpolators.viewportInterpolator2D = viewportInterpolator2D;            
        })(Ext.Interpolators || (Ext.Interpolators = {}));
        var Interpolators = Ext.Interpolators;
    })(rin.Ext || (rin.Ext = {}));
    var Ext = rin.Ext;
})(rin || (rin = {}));
//@ sourceMappingURL=ViewportInterpolator2D.js.map

/*!
*
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright (c)  2013, Microsoft Research
* By using this source you agree to the terms and conditions detailed in the following licence:
*     http://rinjs.org/licenses/v1.0/
*
* Date: 2013-MARCH-01
*
* This file defines and implements certain common diagnostic functionality.
*
*/
var rin;
(function (rin) {
    (function (diagnostics) {
        function newDiagnosticsModule(moduleName) {
            var doLog = !!(console && console.log);
            return {
                log: function () {
                    var content = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        content[_i] = arguments[_i + 0];
                    }
                    //document.writeln.apply(document, content);
                    doLog && console.log.apply(console, content);
                },
                assert: function assert(cond, strCond) {
                    if(!cond) {
                        throw {
                            name: "assertionFailureException",
                            message: "MODULE: " + moduleName + " ASSERTION: " + strCond
                        };
                    }
                },
                throwDuplicateException: function (msg) {
                    throw {
                        name: "duplicateObjectException",
                        message: "MODULE: " + moduleName + " ASSERTION: " + msg
                    };
                }
            };
        }
        diagnostics.newDiagnosticsModule = newDiagnosticsModule;
    })(rin.diagnostics || (rin.diagnostics = {}));
    var diagnostics = rin.diagnostics;
})(rin || (rin = {}));
//@ sourceMappingURL=diagnostics.js.map

/*!
*
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright (c)  2013, Microsoft Research
* By using this source you agree to the terms and conditions detailed in the following licence:
*     http://rinjs.org/licenses/v1.0/
*
* Date: 2013-MARCH-01
*
* This file implements the default (built in) implementation of the
* "base2DGroupPolicy" Embedded Artifacts Group Policy
*
*/
/// <reference path="embeddedArtifactTypes.d.ts"/>
var rin;
(function (rin) {
    (function (embeddedArtifacts) {
        (function (BuiltinPolicies) {
            (function (base2DGroupPolicy) {
                ; ;
                function newInstance(collection, provider) {
                    var MAX_INACTIVE_COUNT = 1;
                    var tmpRegion = {
                        center: {
                            x: 0,
                            y: 0
                        },
                        span: {
                            x: 0,
                            y: 0
                        }
                    };// WARNING: used in return function "evaluate".
                    
                    var tmpPoint1 = {
                        x: 0,
                        y: 0
                    };// WARNING: Used by convertRegionToScreen
                    
                    var tmpPoint2 = {
                        x: 0,
                        y: 0
                    };// WARNING: Used by convertRegionToScreen
                    
                    var screenDimensions = {
                        center: {
                            x: 0,
                            y: 0
                        },
                        span: {
                            x: 0,
                            y: 0
                        }
                    };
                    var workingItemsToCull = [];
                    var minEAScale = 0.24, maxEAScale = 1;
                    var convertRegionToWorld = provider.convertRegionToWorld2D || function (inRegion, outRegion) {
                        return false;
                    };
                    var convertRegionToScreen = provider.convertRegionToScreen2D || function (inRegion, outRegion) {
                        //
                        // This function calls convertRegionToPoint2D to transform the center, then computes the height and width by
                        // transforming another point (height/2, width/2) away and computing the difference. It will work fine for the case that
                        // there is no coordinate rollover and the world-to-viewport transformation is linear.
                        //
                        // NOTE: It uses TMP VARIABLES tmpPoint1, tmpPoint2!
                        //
                        var ret;
                        ret = provider.convertPointToScreen2D(inRegion.center, outRegion.center);
                        if(ret) {
                            tmpPoint1.x = inRegion.center.x - inRegion.span.x / 2;
                            tmpPoint1.y = inRegion.center.y - inRegion.span.y / 2;
                            ret = provider.convertPointToScreen2D(tmpPoint1, tmpPoint2);
                            if(ret) {
                                outRegion.span.x = Math.abs(outRegion.center.x - tmpPoint2.x) * 2.0;
                                outRegion.span.y = Math.abs(outRegion.center.y - tmpPoint2.y) * 2.0;
                            }
                        }
                        if(!ret) {
                            outRegion.center.x = outRegion.center.y = outRegion.span.x = outRegion.span.y = NaN;
                        }
                        return ret;
                    };
                    //function interval_intersects(i1from: number, i1to: number, i2from: number, i2to: number): bool {
                    //    return (i1from <= i2from) ? (i1to > i2from) : interval_intersects(i2from, i2to, i1from, i1to);
                    //};
                    function region_intersects(r1, r2) {
                        // Assumes no coordinate roll-over.
                        // Get vertices of the two regions.
                                                var Ax1 = r1.center.x - r1.span.x / 2, Ay1 = r1.center.y - r1.span.y / 2, Ax2 = r1.center.x + r1.span.x / 2, Ay2 = r1.center.y + r1.span.y / 2, Bx1 = r2.center.x - r2.span.x / 2, By1 = r2.center.y - r2.span.y / 2, Bx2 = r2.center.x + r2.span.x / 2, By2 = r2.center.y + r2.span.y / 2;
                        // Check if regions overlap.
                        return (Ax1 <= Bx2 && Ax2 >= Bx1 && Ay1 <= By2 && Ay2 >= By1);
                        //return interval_intersects(r1.center.x - r1.span.x / 2, r1.center.x + r1.span.x / 2, r2.center.x - r2.span.x / 2, r2.center.x + r2.span.x / 2)
                        //&& interval_intersects(r1.center.y - r1.span.y / 2, r1.center.y + r1.span.y / 2, r2.center.y - r2.span.y / 2, r2.center.y + r2.span.y / 2);
                                            }
                    ; ;
                    function copyPoint(from, to) {
                        to.x = from.x;
                        to.y = from.y;
                    }
                    function copyRegion(from, to) {
                        copyPoint(from.center, to.center);
                        copyPoint(from.span, to.span);
                    }
                    function emptyStateInstance() {
                        return {
                            display: {
                                position: {
                                    center: {
                                        x: NaN,
                                        y: NaN
                                    },
                                    span: {
                                        x: NaN,
                                        y: NaN
                                    }
                                },
                                level: 0,
                                scale: null
                            }
                        };
                    }
                    return {
                        evaluate: function (workingList, experienceSmallState) {
                            var currentLinearParameter = provider.currentLinearParameter ? provider.currentLinearParameter() : NaN;
                            var currentZoom = provider.currentNormalizedZoom ? provider.currentNormalizedZoom() : NaN;
                            provider.getScreenDimensions(screenDimensions);
                            //
                            // Run through each item in the working list, marking them inactive...
                            //
                            workingList.forEach(function (workingItem, id) {
                                if(workingItem.active) {
                                    workingItem.inactiveCount = 0;
                                } else {
                                    var prevCount = workingItem.inactiveCount || 0;
                                    workingItem.inactiveCount = prevCount + 1;
                                    if(workingItem.inactiveCount > MAX_INACTIVE_COUNT) {
                                        workingItemsToCull.push(id);
                                    }
                                }
                                workingItem.active = false;
                            });
                            //
                            // Delete working items that have been hanging around for too many render cycles...
                            //
                            if(workingItemsToCull.length > 0) {
                                workingItemsToCull.forEach(function (id) {
                                    delete workingList[id]// TODO - notify host if non-null host context??
                                    ;
                                });
                                workingItemsToCull = [];
                            }
                            //
                            // Process each item in the collection. If it's in scope, create the object if necessary and update it. If it's not
                            // in scope and still exists, mark it inactive.
                            //
                            collection.forEach(function (item, id) {
                                var workingItem = workingList[id];
                                var active = true;
                                var range, scaleFactor = null, maxScaleZoom = item.maxScaleZoom || NaN;
                                // Scale EA visual depending on zoomlevel
                                                                // Check linear parameter is in range if there is one...
                                if(!isNaN(currentLinearParameter)) {
                                    range = item.parameterRange;
                                    if(range) {
                                        active = currentLinearParameter >= range.from && currentLinearParameter <= range.to;
                                    }
                                }
                                // Check zoom level is in range if there is one...
                                if(active && !isNaN(currentZoom)) {
                                    range = item.zoomRange;
                                    if(range) {
                                        active = currentZoom >= range.from && currentZoom <= range.to;
                                    }
                                }
                                // Check if the item is within the field of view...
                                active = active && convertRegionToScreen(item.region, tmpRegion);
                                active = active && region_intersects(screenDimensions, tmpRegion);
                                if(active) {
                                    // Item is in scope spatially... check if it is in the working set.
                                    if(workingItem) {
                                        workingItem.active = true;
                                        if(workingItem.sourceItem != item) {
                                            // Hmm, the previous mapping between working item and source item is broken.
                                            // This can happen if the source Item list has been re-built, which can happen in
                                            // editing scenarios.
                                            // Let's treat it as a new item....
                                            workingItem.sourceItem = item;
                                            workingItem.hostContext = null// TODO: inform host about this?
                                            ;
                                            workingItem.state = emptyStateInstance();
                                        }
                                    } else {
                                        // Item is in scope  but we don't have it in the working list. Create it...
                                        // TODO: move to constructor once things are settled...
                                        workingItem = {
                                            active: true,
                                            sourceItem: item,
                                            hostContext: null,
                                            state: emptyStateInstance()
                                        };
                                        //function castToWA(sourceItem): WorkingArtifact { return sourceItem };
                                        //function castToAny(sourceItem): any { return sourceItem };
                                        //workingItem = castToWA(item);
                                        workingList[id] = workingItem;
                                    }
                                    //
                                    // Copy over screen coordinates
                                    //
                                    copyRegion(tmpRegion, workingItem.state.display.position);
                                    // Calculate scale of visual relative to the zoom level of the ES
                                    if(!isNaN(currentZoom) && !isNaN(maxScaleZoom)) {
                                        scaleFactor = Math.max(minEAScale, Math.min(1, currentZoom / maxScaleZoom));
                                        workingItem.state.display.scale = scaleFactor;
                                    }
                                    //
                                    // Check if item is overridden to be visible based on the small state.
                                    //
                                    // TODO; for now we ignore small state info.
                                    //var forceVisible = false;
                                                                    }
                                if(!active) {
                                    // item is not in scope...
                                    if(workingItem) {
                                        workingItem.active = false;
                                    }
                                }
                            });
                        }
                    };
                }
                base2DGroupPolicy.newInstance = newInstance;
                ; ;
            })(BuiltinPolicies.base2DGroupPolicy || (BuiltinPolicies.base2DGroupPolicy = {}));
            var base2DGroupPolicy = BuiltinPolicies.base2DGroupPolicy;
        })(embeddedArtifacts.BuiltinPolicies || (embeddedArtifacts.BuiltinPolicies = {}));
        var BuiltinPolicies = embeddedArtifacts.BuiltinPolicies;
    })(rin.embeddedArtifacts || (rin.embeddedArtifacts = {}));
    var embeddedArtifacts = rin.embeddedArtifacts;
})(rin || (rin = {}));
//@ sourceMappingURL=defaultBase2DGroupPolicy.js.map

/*!
*
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright (c)  2013, Microsoft Research
* By using this source you agree to the terms and conditions detailed in the following licence:
*     http://rinjs.org/licenses/v1.0/
*
* Date: 2013-MARCH-01
*
* This file implements the default (built in) implementation of the
* "zoom2DItemPolicy" Embedded Artifacts Group Policy
*
*/
/// <reference path="embeddedArtifactTypes.d.ts"/>
/* FUTURE
module rin.embeddedArtifacts.BuiltinPolicies.zoom2DItemPolicy {

export function newInstance(collection: DataCollection, provider: ProviderProxy): ItemEnvironmentalPolicy {
return {
evaluate: function (workingItem: WorkingArtifact, eaSmallState: SmallState): WorkingArtifact {
return workingItem;
}
};
};
}
*/
//@ sourceMappingURL=defaultZoom2DItemPolicy.js.map

var rin;
(function (rin) {
    (function (embeddedArtifacts) {
        (function (BuiltinPolicies) {
            /*!
            *
            * RIN Core JavaScript Library v1.0
            * http://research.microsoft.com/rin
            *
            * Copyright (c)  2013, Microsoft Research
            * By using this source you agree to the terms and conditions detailed in the following licence:
            *     http://rinjs.org/licenses/v1.0/
            *
            * Date: 2013-MARCH-01
            *
            * This file implements the default (built in) implementation of the
            * "ambientAudioPolicy" Embedded Artifacts Group Policy
            *
            */
            /// <reference path="embeddedArtifactTypes.d.ts"/>
            (function (ambientAudioPolicy) {
                ;
                function emptySoundStateInstance() {
                    return {
                        level: 0
                    };
                }
                function OriginPoint() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
                function getRegion(r) {
                    return r.span.x * r.span.y;
                }
                function getIntersectRegion(r1, r2) {
                    var Ax1 = r1.center.x - r1.span.x / 2, Ay1 = r1.center.y - r1.span.y / 2, Ax2 = r1.center.x + r1.span.x / 2, Ay2 = r1.center.y + r1.span.y / 2, Bx1 = r2.center.x - r2.span.x / 2, By1 = r2.center.y - r2.span.y / 2, Bx2 = r2.center.x + r2.span.x / 2, By2 = r2.center.y + r2.span.y / 2, x_overlap = Math.max(0, Math.min(Ax2, Bx2) - Math.max(Ax1, Bx1)), y_overlap = Math.max(0, Math.min(Ay2, By2) - Math.max(Ay1, By1));
                    return (x_overlap * y_overlap);
                }
                function getDistance(p1, p2) {
                    var xDist = p1.x - p2.x, yDist = p1.y - p2.y;
                    return Math.sqrt(xDist * xDist + yDist * yDist);
                }
                function newInstance(collection, provider) {
                    var screenDimensions = {
                        center: OriginPoint(),
                        span: OriginPoint()
                    };
                    var tmpPoint1 = OriginPoint();// WARNING: Used by convertRegionToScreen
                    
                    var tmpPoint2 = OriginPoint();// WARNING: Used by convertRegionToScreen
                    
                    var convertRegionToScreen = provider.convertRegionToScreen2D || function (inRegion, outRegion) {
                        var ret;
                        ret = provider.convertPointToScreen2D(inRegion.center, outRegion.center);
                        if(ret) {
                            tmpPoint1.x = inRegion.center.x - inRegion.span.x / 2;
                            tmpPoint1.y = inRegion.center.y - inRegion.span.y / 2;
                            ret = provider.convertPointToScreen2D(tmpPoint1, tmpPoint2);
                            if(ret) {
                                outRegion.span.x = Math.abs(outRegion.center.x - tmpPoint2.x) * 2.0;
                                outRegion.span.y = Math.abs(outRegion.center.y - tmpPoint2.y) * 2.0;
                            }
                        }
                        if(!ret) {
                            outRegion.center.x = outRegion.center.y = outRegion.span.x = outRegion.span.y = NaN;
                        }
                        return ret;
                    };
                    function evaluate(workingList, experienceSmallState) {
                        provider.getScreenDimensions(screenDimensions);
                        var maxArea = getRegion(screenDimensions), maxDistance = getDistance(screenDimensions.center, OriginPoint());
                        workingList.forEach(function (workingItem, id) {
                            if(!workingItem.state.sound) {
                                workingItem.state.sound = emptySoundStateInstance();
                            }
                            if(workingItem.active) {
                                var itemRegion = {
                                    center: OriginPoint(),
                                    span: OriginPoint()
                                };
                                convertRegionToScreen(workingItem.sourceItem.region, itemRegion);
                                var itemIntersectArea = getIntersectRegion(screenDimensions, itemRegion), volumeLevel = ((itemIntersectArea) / maxArea) * ((maxDistance - getDistance(itemRegion.center, screenDimensions.center)) / maxDistance);
                                workingItem.state.sound.level = volumeLevel;
                            } else {
                                workingItem.state.sound.level = 0;
                            }
                        });
                    }
                    return {
                        evaluate: evaluate
                    };
                }
                ambientAudioPolicy.newInstance = newInstance;
                ;
            })(BuiltinPolicies.ambientAudioPolicy || (BuiltinPolicies.ambientAudioPolicy = {}));
            var ambientAudioPolicy = BuiltinPolicies.ambientAudioPolicy;
        })(embeddedArtifacts.BuiltinPolicies || (embeddedArtifacts.BuiltinPolicies = {}));
        var BuiltinPolicies = embeddedArtifacts.BuiltinPolicies;
    })(rin.embeddedArtifacts || (rin.embeddedArtifacts = {}));
    var embeddedArtifacts = rin.embeddedArtifacts;
})(rin || (rin = {}));
//@ sourceMappingURL=ambientAudioPolicy.js.map

/*!
*
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright (c)  2013, Microsoft Research
* By using this source you agree to the terms and conditions detailed in the following licence:
*     http://rinjs.org/licenses/v1.0/
*
* Date: 2013-MARCH-01
*
* This file  implements the  Layout Engine for Embedded Artifacts
*
*/
/// <reference path="embeddedArtifactTypes.d.ts"/>
/// <reference path="diagnostics.d.ts"/>
var rin;
(function (rin) {
    (function (embeddedArtifacts) {
            })(rin.embeddedArtifacts || (rin.embeddedArtifacts = {}));
    var embeddedArtifacts = rin.embeddedArtifacts;
})(rin || (rin = {}));
var rin;
(function (rin) {
    (function (embeddedArtifacts) {
        var debug = rin.diagnostics.newDiagnosticsModule("EA-LE");
        //
        // Private WorkingArtifactsList class
        //
        var WorkingArtifactsListClass = (function () {
            function WorkingArtifactsListClass() { }
            WorkingArtifactsListClass.prototype.forEach = function (func) {
                processOwnProperties(this, func);
                /*var id;
                for (id in this) {
                if (this.hasOwnProperty(id)) {
                var item = this[id];
                func(item, id, this);
                }
                }*/
                            };
            return WorkingArtifactsListClass;
        })();        
        //
        // Private class represents a single pipeline of embedded artifacts - from source through rendering engine.
        //
        var EmbeddedArtifactsPipeline = (function () {
            function EmbeddedArtifactsPipeline(helper, collection, groupPolicyIds, /*itemPolicyIds: string[],*/ provider, host) {
                var _this = this;
                this.collection = collection;
                this.workingItems = new WorkingArtifactsListClass();
                this.host = host;
                this.provider = provider;
                // FUTURE? this.itemPolicies = [];
                this.groupPolicies = [];
                groupPolicyIds.forEach(function (id) {
                    // LAMBDA FAT ARROW - note this is translated to _this!
                    var policy = helper.newGroupPolicy(id, collection, provider);
                    _this.groupPolicies.push(policy);
                });
                /* FUTURE?
                itemPolicyIds.forEach(function (id) {
                var policy = helper.newItemPolicy(id, collection, provider);
                this.itemPolicies.push(policy);
                });*/
                            }
            EmbeddedArtifactsPipeline.prototype.process = function (keyframeState) {
                var _this = this;
                //
                // Apply group policies...
                //
                this.groupPolicies.forEach(function (policy) {
                    // FAT ARROW FUNCTION - this goes to _this
                    policy.evaluate(_this.workingItems, keyframeState);
                });
                /* FUTURE?
                
                //
                // Apply item policies...
                //
                if (this.itemPolicies.length !== 0) {
                this.workingItems.forEach(
                (item, id, list) => {
                var itemState: SmallState = this.extractItemStateFromExperienceState(keyframeState, this.collection.collectionId, id);
                this.itemPolicies.forEach(
                function (policy, index, a) {
                policy.evaluate(item, itemState);
                }
                )
                }
                );
                }
                */
                //
                // Pass to host
                //
                this.host.update(this.workingItems);
            };
            EmbeddedArtifactsPipeline.prototype.extractItemStateFromExperienceState = function (experienceState, collectionId, itemId) {
                return {
                };
            };
            return EmbeddedArtifactsPipeline;
        })();        
        ; ;
        function newLayoutEngine(helper) {
            var pipelines = {
            };
            return {
                addPipeline: function (collection, groupPolicyIds, /*itemPolicyIds: string[],*/ provider, host) {
                    //
                    // We do not support the same collection in multiple pipelines. Check if we already have one with this.
                    //
                    var collectionId = collection.collectionId;
                    if(pipelines.hasOwnProperty(collectionId)) {
                        debug.throwDuplicateException("Already have pipeline with collection id " + collection.collectionId);
                    }
                    ; ;
                    var newPipeline = new EmbeddedArtifactsPipeline(helper, collection, groupPolicyIds, /*itemPolicyIds,*/ provider, host);
                    pipelines[collectionId] = (newPipeline);
                },
                deletePipeline: function (collectionId) {
                    //
                    // We do not support the same collection in multiple pipelines. Check if we already have one with this.
                    //
                    if(pipelines.hasOwnProperty(collectionId)) {
                        delete pipelines[collectionId];
                    }
                },
                render: function (experienceState) {
                    processOwnProperties(pipelines, function (pipeline) {
                        pipeline.process(experienceState);
                    });
                }
            };
        }
        embeddedArtifacts.newLayoutEngine = newLayoutEngine;
        ; ;
        function newDefaultGroupPolicy(policyId, collection, provider) {
            var policyFactory = rin.embeddedArtifacts.BuiltinPolicies[policyId];
            return policyFactory && policyFactory.newInstance(collection, provider);
        }
        embeddedArtifacts.newDefaultGroupPolicy = newDefaultGroupPolicy;
        /* FUTURE?
        export function newDefaultItemPolicy(policyId: string, collection: DataCollection, provider: ProviderProxy): ItemEnvironmentalPolicy {
        var policyFactory = rin.ext.EmbeddedArtifacts.BuiltinPolicies[policyId];
        return policyFactory && policyFactory.newInstance(collection, provider);
        }
        */
        //
        // Utility function to run a function over all owned properties in an object.
        //
        function processOwnProperties(obj, func) {
            var id;
            for(id in obj) {
                if(obj.hasOwnProperty(id)) {
                    var prop = obj[id];
                    func(prop, id, obj);
                }
            }
        }
    })(rin.embeddedArtifacts || (rin.embeddedArtifacts = {}));
    var embeddedArtifacts = rin.embeddedArtifacts;
})(rin || (rin = {}));
//@ sourceMappingURL=layoutEngine.js.map

/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/Orchestrator.js" />

window.rin = window.rin || {};
rin.embeddedArtifacts = rin.embeddedArtifacts || {}

// Container class for all arguments for making an interaction request
rin.InteractionBehaviorArgs = function (orchestrator, sourceES, sourceEA) {
    this.orchestrator = orchestrator;
    this.sourceES = sourceES;
    this.sourceEA = sourceEA;
};

// Module to register and execute interaction behaviors.
// We are not using behavior factories here to keep things simple. In most cases behaviors dosent have a state of its own
// so we need not instantiate new objects for executing one behavior. In case a behavior have state, it can internally create a 
// new behavior object inside the execute() call.
rin.interactionBehaviorService = {
    _behaviors: [],

    registerInteractionBehavior: function (behaviorKey, behavior) {
        if (!behavior || !behaviorKey) return;
        if (typeof (behavior.execute) != "function") return;
        this._behaviors.push({ key: behaviorKey, value: behavior });
    },

    executeInteractionBehavior: function (behaviorKey, interactionArgs, onCompleteCallback) {
        if (!behaviorKey || !interactionArgs) return;

        for (var i = this._behaviors.length - 1; i >= 0; i--) {
            if (this._behaviors[i].key === behaviorKey) {
                this._behaviors[i].value.execute(interactionArgs, onCompleteCallback || function () { });
                break;
            }
        }
    }
};

window.rin = window.rin || {};
rin.embeddedArtifacts = rin.embeddedArtifacts || {}

// Module to help with loading artifact visuals
rin.embeddedArtifacts.artifactManager = (function () {
    var loadedStyles = {}; // dictionary to store styles which are already loaded

    // Inject a given css style to the current document
    var injectStyle = function (styleString) {
        var head_node = document.getElementsByTagName('head')[0];
        var style_tag = document.createElement('style');
        style_tag.innerHTML = styleString;
        style_tag.setAttribute('rel', 'stylesheet');
        style_tag.setAttribute('type', 'text/css');
        head_node.appendChild(style_tag);
    };

    // Load the visual for ea. This will take care of downloading the visual and caching
    var loadVisual = function (ea, resourceResolver, onLoadCompleteCallback) {
        // Process the visual once its downloaded
        var visualDownloaded = function (visual) {
            visual.style.position = "absolute";

            if (visual.attributes["height"])
                visual.height = parseFloat(visual.attributes["height"].value);
            else
                visual.height = 0;

            if (visual.attributes["height"])
                visual.width = parseFloat(visual.attributes["width"].value);
            else
                visual.width = 0;

            if (visual.attributes["anchorX"])
                visual.anchorX = parseFloat(visual.attributes["anchorX"].value);
            else
                visual.anchorX = 0;

            if (visual.attributes["anchorY"])
                visual.anchorY = parseFloat(visual.attributes["anchorY"].value);
            else
                visual.anchorY = 0;

            if (typeof (onLoadCompleteCallback) === "function")
                onLoadCompleteCallback(visual);
        };

        // Download the visual and build the DOM element
        var styleLoadComplete = function () {
            var containerStub = document.createElement("div");
            var visualString = ea.visualLoadHelper.getContent(function (visualString) {
                containerStub.innerHTML = visualString;
                visualDownloaded(containerStub.firstChild, ea);
            }, resourceResolver);
        };

        // Load styles if mentioned and then go on to visual load
        var styleSource = ea.styleLoadHelper.getSource();
        if (styleSource) {
            if (!loadedStyles.hasOwnProperty(styleSource)) {
                ea.styleLoadHelper.getContent(function (styleString) {
                    injectStyle(styleString);
                    styleLoadComplete();
                }, resourceResolver);
            }
            else styleLoadComplete();
        }
    }

    // Public members
    return {
        loadArtifactVisual: loadVisual
    };
})();

// EA Host takes care of rendering an EA on screen, it also loads the visual for an ea, does caching etc..
// This will inject a new div/canvas to the parent Element specified, but will be transparent.
rin.embeddedArtifacts.ArtifactHost = function (parentElement, orchestrator) {
    var self = this;
    var displayState = {visible:"block",hidden:"none"};
    var currentEAList = {}; // list of all EA's currently in the host
    var resourceResolver = orchestrator.getResourceResolver();
    var scaleTransformCSSProperty = "transform";
    if (!parentElement) return;

    // Inject a canvas for hosting the EAs
    var canvas = document.createElement("div");
    canvas.setAttribute("class","rinDefault2DHost");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    //canvas.style.position = "absolute"; // This is commented out as this breaks mouse interactions on panorama ES.
    canvas.style.background = "transparent";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";
    parentElement.appendChild(canvas);

    orchestrator.playerStateChangedEvent.subscribe(function (state) {
        for (id in currentEAList) {
            if (currentEAList.hasOwnProperty(id)) {
                currentEAList[id].actualEA.onPlayerStateChanged(state);
            }
        }
    });

    // Execute appropriate behaviors if an EA is asking for one
    var onInteractionRequest = function (args) {
        var matchedSourceItem;
        // Find the source item for the ea
        for (id in currentEAList) {
            if (currentEAList.hasOwnProperty(id)) {
                if (currentEAList[id].actualEA === args.actualEA)
                {
                    matchedSourceItem = currentEAList[id].sourceItem;
                    break;
                }
            }
        }
        if (!matchedSourceItem || !matchedSourceItem.defaultInteractionBehavior) return;

        args.orchestrator = orchestrator;
        args.host = self;
        args.sourceItem = matchedSourceItem;
        rin.interactionBehaviorService.executeInteractionBehavior(matchedSourceItem.defaultInteractionBehavior, args);
    };

    this.updateLayout = function () {
        for (id in currentEAList) {
            if (currentEAList.hasOwnProperty(id)) {
                var ea = currentEAList[id];
                // update ea position
                if (ea.actualEA.visual && ea.actualEA.visual.style) {
                    var offset = ea.actualEA.getAnchoredOffset();
                    ea.actualEA.visual.style.left = (ea.state.display.position.center.x - offset.x) + "px";
                    ea.actualEA.visual.style.top = (ea.state.display.position.center.y - offset.y) + "px";
                    // Hide the ea by opacity till the visual is loaded and redered once so that the proper anchoring position can be calculated. Else the EA will jump around initially before they appear right.
                    ea.actualEA.visual.style.opacity = (ea.actualEA.visual.clientWidth > 0 && ea.actualEA.visual.clientHeight > 0) ? ea.state.display.opacity || 1 : 0;
                    ea.actualEA.visual.style.display = ea.active ? displayState.visible : displayState.hidden;
                    if (ea.state.display.scale) // null, undefined, 0.0 are all invalid values for scale.
                        ea.actualEA.visual.style.transform = "scale(" + ea.state.display.scale + "," + ea.state.display.scale + ")";
                }
                if (ea.active && ea.state.sound) {
                    ea.actualEA.setVolume(ea.state.sound.level);
                }
                else {
                    ea.actualEA.setVolume(0);
                }
            }
        }
    };
    
    this.update = function (eaList) {
        // remove existing items if not present in updated list
        for (id in currentEAList) {
            if (currentEAList.hasOwnProperty(id) && !eaList.hasOwnProperty(id)) {
                self.removeArtifact(currentEAList[id]);
            }
        }

        // process updated list
        for (id in eaList) {
            var ea = eaList[id];
            if (eaList.hasOwnProperty(id) && !currentEAList.hasOwnProperty(id)) {
                self.addArtifact(ea);
            }
        }

        this.updateLayout();
    };

    this.checkOverlap = function (a, b) { return false; };

    // Add a new artifact to the host
    this.addArtifact = function (ea) {
        if (!ea) return;
        currentEAList[ea.sourceItem.id] = ea;
        
            var base = window;
            for (var i = 0, ns = ea.sourceItem.eaTypeId.split('.') ; i < ns.length; ++i) {
                base = base[ns[i]];
            }

        if(typeof base == "function"){
            ea.actualEA = new base(ea.sourceItem, resourceResolver);
            ea.actualEA.isInPlayMode = orchestrator.getPlayerState() == rin.contracts.playerState.playing;

            rin.embeddedArtifacts.artifactManager.loadArtifactVisual(ea.actualEA, resourceResolver, function (visual) {
                visual.eaid = ea.sourceItem.id;
                visual.style.display = "none";
                // make sure the ea is still in active list
                if (!currentEAList.hasOwnProperty(ea.sourceItem.id)) return;
                ea.actualEA.visual = visual;
                ko.applyBindings(ea.actualEA, visual);
                //ea.layoutChanged.subscribe(self.updateLayout, null, this);
                ea.actualEA.interactionRequested.subscribe(onInteractionRequest, null, this);
                
                canvas.appendChild(visual);
                if (ea.actualEA.visualLoadComplete)
                    ea.actualEA.visualLoadComplete();
            });
        }
    };

    // Remove an existing artifact from the host
    this.removeArtifact = function (ea) {
        if (currentEAList.hasOwnProperty(ea.sourceItem.id)) {
            // remove data and bindings
            delete currentEAList[id];
            ea.actualEA.interactionRequested.unsubscribe(onInteractionRequest);
            //ea.layoutChanged.unsubscribe(self.updateLayout);

            // remove the visual
            for (var i = 0; i < canvas.children.length; i++) {
                var currentChild = canvas.children[i];
                if (currentChild.eaid == ea.sourceItem.id) {
                    canvas.removeChild(currentChild);
                    return;
                }
            }
        }
    };

    this.removeAll = function(removeSelf){
        for (id in currentEAList) {
            if (currentEAList.hasOwnProperty(id)) {
                self.removeArtifact(currentEAList[id]);
            }
        }

        if (removeSelf == true) {
            if (canvas.parentElement && typeof canvas.parentElement.removeChild === "function") //TODO: Investigate why this is needed. Added for everest as an expection was thrown from here that causes pano to be unresponsive.
                canvas.parentElement.removeChild(canvas);
        }
    };

    this.show = function () { canvas.style.display = "block"; };
    this.hide = function () { canvas.style.display = "none"; };

    this.updateLayout();
};
window.rin = window.rin || {};
rin.embeddedArtifacts = rin.embeddedArtifacts || {}

// Module to help with loading artifact visuals
rin.embeddedArtifacts.embeddedArtifactsController = function (orchestrator) {
    var self = this;

    orchestrator.currentESItemsChanged.subscribe(function (changeData) {
        if (changeData.removedItems)
            for (var i = 0; i < changeData.removedItems.length; i++) {
                var esInfo = changeData.removedItems[i];
                if (!esInfo || !esInfo.experienceStream) continue;
                if (!esInfo.esData || !esInfo.esData.data || !esInfo.esData.data.EmbeddedArtifacts) continue;
                if (esInfo.embeddedArtifacts && esInfo.embeddedArtifacts == null) continue;

                self.removeEAComponents(esInfo);
            }

        if (changeData.addedItems)
            for (var i = 0; i < changeData.addedItems.length; i++) {
                var esInfo = changeData.addedItems[i];
                if (!esInfo || !esInfo.experienceStream || !esInfo.experienceStream.getEmbeddedArtifactsProxy) continue;
                if (!esInfo.esData.data.EmbeddedArtifacts) continue;
                if (esInfo.embeddedArtifacts && esInfo.embeddedArtifacts != null) continue;

                self.addEAComponents(esInfo);
            }
    }, "eaController");

    this.unload = function () {
        var currentItems = orchestrator.getCurrentESItems();
        if (currentItems)
            for (var i = 0; i < currentItems.length; i++) {
                var esInfo = currentItems[i];
                if (!esInfo || !esInfo.experienceStream) continue;
                if (!esInfo.esData || !esInfo.esData.data.EmbeddedArtifacts) continue;
                if (esInfo.embeddedArtifacts && esInfo.embeddedArtifacts == null) continue;

                self.removeEAComponents(esInfo);
            }
    };

    function createDataCollection(a, id) {
        var collection = {
            collectionId: id,
            forEach: function (func) {
                a.forEach(function (val, index) {
                    func(val, val["id"], collection);
                });
            }
        };
        return collection;
    };

    var testEngineHelper = {
        newGroupPolicy: function (policyId, collection, provider) {
            return rin.embeddedArtifacts.newDefaultGroupPolicy(policyId, collection, provider, orchestrator);
        },
    };

    this.addEAComponents = function (esInfo) {
        var le = rin.embeddedArtifacts.newLayoutEngine(testEngineHelper, orchestrator);
        esInfo.embeddedArtifacts = { "layoutEngine": le, "host": null, "updateLoopTimerID": null };

        // Download EA data from the specified source.
        var downloadHelper = new rin.internal.AjaxDownloadHelper(
            orchestrator.getResourceResolver().resolveResource(esInfo.esData.data.EmbeddedArtifacts.datasource));
        downloadHelper.getContent(function (eaData) {
            var eaJsonData = JSON.parse(eaData);
            var testCollection = createDataCollection(eaJsonData, "eaDataCollection");

            function loadEAComponents() {
                if (esInfo.experienceStream.getState() == "ready") { // TODO: may need to use a better approach to make sure the code inside runs only after the ES is loaded.
                    // TODO: passing layout engine to ES proxy might not be the best but to avoid creating another event, im using this method for now.
                    var providerProxy = esInfo.experienceStream.getEmbeddedArtifactsProxy(le); // ES needs to call le.render({}) anytime the ES updates itself.
                    var eaContainer = providerProxy.getEmbeddedArtifactsContainer();

                    // Remove any existing EA host. This is a workaround as many times remove components is not getting called and the host remains in the DOM.
                    // This happens only when a deepstate link is used from inside RIN.

                    var existingHost = eaContainer.getElementsByClassName("rinDefault2DHost");
                    if (existingHost.length > 0)
                        eaContainer.removeChild(existingHost[0]);

                    var host = new rin.embeddedArtifacts.ArtifactHost(eaContainer,
                        new rin.internal.OrchestratorProxy(orchestrator));
                    esInfo.embeddedArtifacts.host = host;

                    // Hide EAs while the narrative is playing if configured to do so.
                    if (esInfo.esData.data.EmbeddedArtifacts.hideDuringPlay && esInfo.esData.data.EmbeddedArtifacts.hideDuringPlay == true) {
                        // Check current status and update the host.
                        if (orchestrator.getPlayerState() == rin.contracts.playerState.playing)
                            host.hide();

                        // Monitor status changes and update the host.
                        orchestrator.playerStateChangedEvent.subscribe(function (state) {
                            if (state.currentState == rin.contracts.playerState.pausedForExplore)
                                host.show();
                            else if (state.currentState == rin.contracts.playerState.playing)
                                host.hide();
                        }, esInfo.id);

                        // Hide EAs on transition events
                        orchestrator.playerESEvent.subscribe(function (state) {
                            if (state && state.eventId == rin.contracts.esEventIds.resumeTransitionEvent &&
                                state.sender._esData.experienceId == esInfo.experienceId) {
                                if (state.eventData.transitionState == "started")
                                    host.hide();
                                else if (state.eventData.transitionState == "interrupted")
                                    host.show();
                            }
                        }, esInfo.id);
                    }

                    le.addPipeline(testCollection, esInfo.esData.data.EmbeddedArtifacts.policies, providerProxy, host);

                    // Below loop is to ensure that any layout changes in EA visuals are applied even if the ES dosent call render().
                    function updateLoop() {
                        
                        rin.internal.debug.assert(orchestrator.getIsOnStage(esInfo.experienceStream));
                        le.render({});
                    };

                    esInfo.embeddedArtifacts.updateLoopTimerID = setInterval(updateLoop, 500);
                }
                else if (esInfo.experienceStream.getState() != "error") {
                    setTimeout(loadEAComponents, 500);
                }
            }
            loadEAComponents();
        });
    };

    this.removeEAComponents = function (esInfo) {
        if (esInfo && esInfo.embeddedArtifacts && esInfo.embeddedArtifacts.host) {
            clearInterval(esInfo.embeddedArtifacts.updateLoopTimerID);
            orchestrator.playerStateChangedEvent.unsubscribe(esInfo.id);
            orchestrator.playerESEvent.unsubscribe(esInfo.id);
            esInfo.embeddedArtifacts.host.removeAll(true);
            esInfo.embeddedArtifacts = null;
        }
    };
};
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};
window.rin.defaults = window.rin.defaults || {};

// Call to register callback every time the browser redraws a page.
rin.internal.requestAnimFrame = (function () {
    
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        // TODO: use adaptive framerate shim
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    // PhantomJS (used for running QUnit tests) won't allow a bind() on the native
    // method, so we'll wrap the invocation and use call() which is allowed.
    return function (callback) {
        // requestAnimationFrame must be called in the global context
        requestAnimationFrame.call(window, callback);
    };

})();

// A helper module to download any content from a remote url
rin.internal.AjaxDownloadHelper = function (url, content) {

    // Get the source specified for this helper
    this.getSource = function () {
        return url ? url : content;
    };

    // Download the content from the specified source
    this.getContent = function (callback, resourceResolver) {
        if (content) {
            callback(content);
        }
        else if (url) {
            var resolvedUrl = resourceResolver ? resourceResolver.resolveSystemResource(url) : url;
            $.get(resolvedUrl, null, function (string) {
                callback(string);
            });
        }
        else
            throw new Error("Neither Url nor content is provided.");
    };
};

// Bunch of utility methods to help with developing components for RIN
// todo: Find correct way to do many of these util functions like startsWith, endsWith, isAbsoluteUrl, getDocumentLocationRootUrl etc.
rin.util = {
    // Util method for inheriting from a class and setting up basic properties to access the parent.
    extend : function(Super, Sub) {
        // By using a dummy constructor, initialization side-effects are eliminated.
        function Dummy() { }
        // Set dummy prototype to Super prototype.
        Dummy.prototype = Super.prototype;
        // Create Sub prototype as a new instance of dummy.
        Sub.prototype = new Dummy();
        // The .constructor propery is really the Super constructor.
        Sub.baseConstructor = Sub.prototype.constructor;
        // Update the .constructor property to point to the Sub constructor.
        Sub.prototype.constructor = Sub;
        // A convenient reference to the super constructor.
        Sub.parentConstructor = Super;
        // A convenient reference to the super prototype.
        Sub.parentPrototype = Super.prototype;
    },

    // Replace placeholders in a string with values. ex: stringFormat('From of {0} to {1}', 'top', 'bottom') -> 'From top to bottom'
    stringFormat: function (text) {
        var args = arguments;
        return text.replace(/\{(\d+)\}/g, function (matchedPattern, matchedValue) {
            return args[parseInt(matchedValue, 10) + 1];
        });
    },

    // Remove leading and trailing white spaces from a string
    trim: function (text) {
        return (text || "").replace(/^\s+|\s+$/g, "");
    },

    // Checks if the string starts with a given substring.
    startsWith: function (text, string) {
        if (!text || !string || text.length < string.length) return false;
        return (text.substr(0, string.length) === string);
    },

    // Checks if the string ends with a given substring.
    endsWith: function (text, string) {
        if (!text || !string || text.length < string.length) return false;
        return (text.substr(text.length - string.length) === string);
    },

    // Checks if a given Url is absolute or not.
    isAbsoluteUrl: function (url) {
        return (/^[a-z]{1,5}:\/\//i).test(url);
    },

    // Set the opacity of an element.
    setElementOpacity: function (targetElement, opacityValue) {
        if (targetElement && targetElement.style) {
            targetElement.style.opacity = opacityValue;
            targetElement.style.filter = "alpha(opacity=" + opacityValue * 100 + ")";
        }
    },

    // Checks if 'child' is present in 'childItems'.
    hasChildElement: function (childItems, child) {
        for (var i = 0, len = childItems.length; i < len; i++) if (childItems[i] == child) return true;
        return false;
    },
    // Assigns a DOM string to a DOM element.
    assignAsInnerHTMLUnsafe: function (node, html) {
        if (window.MSApp !== undefined && window.MSApp.execUnsafeLocalFunction) {
            window.MSApp.execUnsafeLocalFunction(function () {
                node.innerHTML = html;
            });
        }
        else {
            node.innerHTML = html;
        }
    },
    // Creates a DOM element from the html specified and wraps it in a div.
    createElementWithHtml: function (html) {
        var div = document.createElement("div");
        rin.util.assignAsInnerHTMLUnsafe(div, html);
        return div;
    },

    // An arbitary string which is different everytime it is evaluated.
    expando: "rin" + Date.now(),

    // Counter for using as a unique id for items in rin scope.
    uuid: 0,

    // Returns the UID of the object.
    getUniqueIdIfObject: function (object) {
        if (typeof object != "object") return object;
        var id = object[this.expando];
        if (!id) id = object[this.expando] = ++this.uuid;
        return id;
    },

    // Replaces properties in 'toObject' with the ones in 'fromObject' but not add any extra.
    overrideProperties: function (fromObject, toObject) {
        for (var prop in fromObject) toObject[prop] = fromObject[prop];
        return toObject;
    },

    // Shallow copy the object. Only members are copied and so the resulting object will not be of the same type.
    shallowCopy: function (obj) {
        var temp = {};
        this.overrideProperties(obj, temp);
        return temp;
    },

    // Deep copy the object. Only members are copied and so the resulting object will not be of the same type.
    deepCopy: function (obj) {
        if (typeof (obj) != "object" || obj == null) return obj;
        var temp = obj.constructor();
        for (var i in obj) temp[i] = this.deepCopy(obj[i]);
        return temp;
    },

    // Extract query strings from a Url and return it as a property bag.
    getQueryStringParams: function (queryString) {
        var params = {}, queries, tokens, i, l;
        var query = (typeof (queryString) == "undefined") ? document.location.search : queryString;
        var posQuestion = query.indexOf("?");
        if (posQuestion >= 0) query = query.substr(posQuestion + 1);
        queries = query.split("&");

        for (i = 0, l = queries.length; i < l; i++) {
            tokens = queries[i].split('=');
            if (tokens.length == 2) params[tokens[0]] = tokens[1];
        }
        return params;
    },

    removeQueryStringParam: function (queryString, paramToRemove) {
        var answer = "", queries, tokens, i, l;
        var query = (typeof (queryString) == "undefined") ? document.location.search : queryString;
        var posQuestion = query.indexOf("?");
        if (posQuestion >= 0) {
            answer = query.substr(0, posQuestion + 1);
            query = query.substr(posQuestion + 1);
        }
        queries = query.split("&");

        for (i = 0, l = queries.length; i < l; i++) {
            tokens = queries[i].split('=');
            if (tokens[0] !== paramToRemove) answer += ((i === 0) ? "" : "&") + queries[i];
        }
        return answer;
    },

    // Builds a query string from a property bag.
    buildQueryString: function (params) {
        var queryString = "http://default/?";
        var first = true;
        for (var key in params) {
            var first = false;
            if (params.hasOwnProperty(key)) queryString += (first ? "" : "&") + key + "=" + params[key];
        }
        return queryString;
    },

    // Generates a random number between min and max.
    rand: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    // Generates a random number between min to max and rounds it to the nearest integer.
    randInt: function (min, max) {
        return ~~(rin.util.rand(min, max));
    },

    // Hide an element by changing its opacity to 0.
    hideElementByOpacity: function (uiElem) {
        this.setElementOpacity(uiElem, 0);
    },

    // UnHide an element by changing its opacity to 1.
    unhideElementByOpacity: function (uiElem) {
        this.setElementOpacity(uiElem, 1);
    },

    // Parse a string to JSON.
    parseJSON: function (data) { // Code taken from jQuery
        if (typeof data !== "string" || !data) {
            return null;
        }

        // Make sure leading/trailing whitespace is removed (IE can't handle it)
        data = this.trim(data);

        // Attempt to parse using the native JSON parser first
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(data);
        }

        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        var rvalidchars = /^[\],:{}\s]*$/,
	        rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	        rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

        if (rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, ""))) {

            return (new Function("return " + data))();

        }
        jQuery.error("Invalid JSON: " + data);
    },

    // Combines the arguments to form a relative path.
    combinePathElements: function () {
        var returnPath = "";
        for (var i = 0, l = arguments.length; i < l; i++) {
            var pathElement = rin.util.trim(arguments[i]);
            if (pathElement && pathElement[pathElement.length - 1] != "/") pathElement = pathElement + "/";
            if (returnPath && pathElement[0] == "/") pathElement = pathElement.substr(1, pathElement.length);
            returnPath += pathElement;
        }
        return (returnPath.length > 0) ? returnPath.substr(0, returnPath.length - 1) : returnPath;
    },

    // Conver the given relative Uri to and absolute Uri.
    convertToAbsoluteUri: function (relativeUri) {
        if (!relativeUri || relativeUri.length === 0 || this.isAbsoluteUrl(relativeUri)) return relativeUri;

        var rootUrl = this.getDocumentLocationRootUrl();
        if (relativeUri[0] == "/") {
            var slashIndex = rootUrl.indexOf("/",rootUrl.indexOf("//") + 2);
            if (slashIndex != -1) {
                return rootUrl.substr(0, slashIndex) + relativeUri;
            }
            else {
                return rootUrl + relativeUri;
            }
        }
        else {
            return (this.combinePathElements(rootUrl,relativeUri)).replace(/[\w\-\.]+\/..\/|\:\/\/[\w\-\.\/]+http/g, '');
        }
    },

    // Get the root url of the document.
    getDocumentLocationRootUrl: function () {
        if (!this._getDocumentLocationRootUrl) {
            var baseUrl = (document.location.origin ? document.location.origin : document.location.protocol + "//" + document.location.host) + document.location.pathname;
            var lastSlashPos = baseUrl.lastIndexOf("/"); // value 3 is used to skip slashes after protocol, sometime it could be upto 3 slashes.
            this._getDocumentLocationRootUrl = lastSlashPos > document.location.protocol.length + 3 ? baseUrl.substr(0, lastSlashPos) : baseUrl;
        }
        return this._getDocumentLocationRootUrl;
    },

    // Removes all child elements of the given element.
    removeAllChildren: function (element) {
        if (!element) return;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    // Get all keys in a dictionary as an Array.
    getDictionaryKeys: function (dictionary) {
        if (typeof Object.keys !== "function") {
            var keys = [], name;
            for (name in Object) {
                if (Object.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        }
        else
            return Object.keys(dictionary);
    },

    // Get all values in a dictionary as an Array.
    getDictionaryValues: function (dictionary) {
        var dictValues = new rin.internal.List();
        for (var key in dictionary)
            if (dictionary.hasOwnProperty(key)) dictValues.push(dictionary[key]);
        return dictValues;
    },

    // Convert an array like object to an Array.
    makeArray: function (arrayLikeObject) {
        var result = [];
        for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
            result.push(arrayLikeObject[i]);
        }
        return result;
    },

    // Empty function.
    emptyFunction: function () { }
};

// Class providing debug utilities.
rin.internal.debug = {
    // Check if the given expression is true and log if not.
    assert: function (expr, message) {
        if (!expr) {
            this.write(message || "assert failed");
            if (rin.enableDebugger)
                debugger;
        }
    },
    debugWriteElement: null,

    // Log any message to the default log.
    write: function (info) {
        if (this.debugWriteElement && this.debugWriteElement.innerHTML) {
            rin.util.assignAsInnerHTMLUnsafe(this.debugWriteElement, info + "<br/>" + this.debugWriteElement.innerHTML);
        }

        // NOTE: we need to check for existence of rin because logging is 
        // called during unload which is problematic within iframes in IE.
        if ((typeof rin !== "undefined") && !rin.disableLogging &&
           (typeof (console) != "undefined") && console && console.log) {

            console.log(info);
        }
    }
};

// prototype changes
if (!String.prototype.rinFormat) {
    String.prototype.rinFormat = function () {
        var args = arguments; // arguments[0].constructor == Array ? arguments[0] : arguments; //todo: make it robust
        return this.replace(/\{(\d+)\}/g, function (matchedPattern, matchedValue) {
            return args[parseInt(matchedValue, 10)];
        });
    };
}

//todo: For creating our own Array like class, consider using below mechanism based on articles like http://dean.edwards.name/weblog/2006/11/hooray/ and http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
/*    var iframe = document.createElement("iframe");
iframe.style.display = "none";
document.body.appendChild(iframe);
frames[frames.length - 1].document.write("<script>parent.rin.internal.List = Array;<\/script>");
*/

// List object with many utility functions over a native array. Inherited from Array.
rin.internal.List = function () {
    if (arguments && arguments.length > 0) Array.prototype.push.apply(this, Array.prototype.slice.call(arguments, 0));
};
rin.internal.List.prototype = [];

// Get the last element of the list or null.
rin.internal.List.prototype.lastOrDefault = function (predicate) {
    for (var i = this.length - 1; i >= 0; i--) if (!predicate || predicate(this[i])) return this[i]; return null;
};

// Get the first element of the list or null.
rin.internal.List.prototype.firstOrDefault = function (predicate) {
    for (var i = 0, len = this.length; i < len; i++) if (!predicate || predicate(this[i])) return this[i]; return null;
};

// Returns true if any of the elements satisfies the predicate fuction.
rin.internal.List.prototype.any = function (predicate) {
    for (var i = 0, len = this.length; i < len; i++) if (!predicate || predicate(this[i])) return true; return false;
};

// Returns the index of the first item which satisfies the predicate function. Or returns null.
rin.internal.List.prototype.firstOrDefaultIndex = function (predicate) {
    for (var i = 0, len = this.length; i < len; i++) if (!predicate || predicate(this[i])) return i; return -1;
};

// Returns a new List with all the elements transformed as defined by the predicate.
rin.internal.List.prototype.select = function (predicate) {
    var out = new rin.internal.List(); for (var i = 0, len = this.length; i < len; i++) out.push(predicate(this[i])); return out;
};

// Calls the predicate function once with each item in the list.
rin.internal.List.prototype.foreach = function (predicate, context) {
    for (var i = 0, len = this.length; i < len; i++) predicate.call(context || this, this[i], i);
};

// Checks if the object specified is present in the list.
rin.internal.List.prototype.contains = function (obj) {
    return this.indexOf(obj) >= 0;
};

// Returns a new List with items except the ones in the array passed in.
rin.internal.List.prototype.except = function (items) {
    rin.internal.debug.assert(items.constructor == Array, "Non array is passed in except method");
    var temp = {}; var out = new rin.internal.List();
    for (var i = 0, len = items.length; i < len; i++) temp[rin.util.getUniqueIdIfObject(items[i])] = true;
    for (var i = 0, len = this.length; i < len; i++) if (!temp[rin.util.getUniqueIdIfObject(this[i])]) out.push(this[i]);
    return out;
};

// Returns a list of all distinct items in the list.
rin.internal.List.prototype.distinct = function () {
    var temp = {}; var out = new rin.internal.List();
    for (var i = 0, len = this.length; i < len; i++) {
        var item = this[i];
        var id = rin.util.getUniqueIdIfObject(item);
        if (!temp[id]) out.push(item);
        temp[id] = true;
    }
    return out;
};

// Defines an indexOf method in the List if Array implementation does not have it.
if (!rin.internal.List.prototype.indexOf) {
    rin.internal.debug.assert(false, "Array List has no indexOf");
    rin.internal.List.prototype.indexOf = function (obj) { for (var i = 0, len = this.length; i < len; i++) if (this[i] == obj) return i; return -1; };
}

// Filter a list and returns all elements satisfying the predicate condition.
rin.internal.List.prototype.filter = function (predicate) { var out = new rin.internal.List(); for (var i = 0, len = this.length; i < len; i++) if (predicate(this[i])) out.push(this[i]); return out; };

// Filter a list and returns all elements satisfying the predicate condition.
rin.internal.List.prototype.where = rin.internal.List.prototype.filter;

// Combine two lists to one.
rin.internal.List.prototype.concat = function (arr) { var out = new rin.internal.List(); Array.prototype.push.apply(out, this); Array.prototype.push.apply(out, arr); return out; };

// Remove the item form the list.
rin.internal.List.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index >= 0) this.splice(index, 1);
    return this;
};

// Get the highest value from the list.
rin.internal.List.prototype.max = function (predicate) {
    var max = this.length > 0 ? predicate(this[0]) : NaN;
    var maxItem = this.length > 0 ? this[0] : null;
    for (var i = 1, len = this.length; i < len; i++) {
        var val = predicate(this[i]);
        if (val > max) { max = val; maxItem = this[i]; }
    }
    return maxItem;
};

// Class to maintain a timespan.
rin.internal.TimeSpan = function (timeSpanMilliSeconds) {
    this._currentTimeSpanMs = timeSpanMilliSeconds || 0;
};

rin.internal.TimeSpan.prototype = {
    // Add 'timespan' to existing timespan.
    add: function (timeSpan) {
        this._currentTimeSpan += timeSpan;
    },

    // Add 'timespan' from existing timespan.
    reduce: function (timeSpan) {
        this._currentTimeSpan -= timeSpan;
    },

    // Checks if 'timespan' is equal to this timespan.
    equals: function (timeSpan) { return timeSpan._currentTimeSpan == this._currentTimeSpan; },

    // Returns the value of this timespan.
    valueOf: function () { return this._currentTimeSpan; },

    _currentTimeSpan: 0
};

// A timespan with zero milliseconds.
rin.internal.TimeSpan.zero = new rin.internal.TimeSpan();

// Timer for making callbacks at defined time period. Supports pause/resume.
rin.internal.Timer = function () { };

rin.internal.Timer.prototype = {
    // Default timer interval.
    intervalSeconds: 1,
    tick: null,
    data: null,
    // Start the timer.
    start: function () {
        this.stop();
        var self = this;
        this.timerId = setTimeout(function () { self._onTick(); }, this.intervalSeconds * 1000);
        this._isRunnning = true;
    },
    // Stop the timer.
    stop: function () {
        if (this.timerId) clearTimeout(this.timerId);
        this._isRunnning = false;
    },
    // Check if the timer is running.
    getIsRunning: function () { return this._isRunnning; },
    timerId: -1,
    _isRunnning: false,
    _onTick: function () {
        if (this.tick) this.tick();
        this.start();
    }
};

// Start the timer with a defined interval and callback.
rin.internal.Timer.startTimer = function (intervalSeconds, tick, data) {
    var timer = new rin.internal.Timer();
    timer.intervalSeconds = intervalSeconds || timer.intervalSeconds;
    timer.tick = tick;
    timer.data = data;
    timer.start();
};

// Stopwatch implementation for maintaining elapsed times.
rin.internal.StopWatch = function () { };

rin.internal.StopWatch.prototype = {
    // Check if the stopwatch is running.
    getIsRunning: function () { return this._isRunning; },
    // Get the total number of seconds the stopwatch was running till now.
    getElapsedSeconds: function () {
        return this._isRunning ? (Date.now() / 1000 - this._startingOffset) + this._elapsedOffset : this._elapsedOffset;
    },
    // Reset the stopwatch.
    reset: function () {
        this._isRunning = false;
        this._startingOffset = 0;
        this._elapsedOffset = 0;
    },
    // Start or resume the stopwatch.
    start: function () {
        this._startingOffset = Date.now() / 1000;
        this._isRunning = true;
    },
    // Stop/Pause the stopwatch.
    stop: function () {
        if (this._isRunning) this._elapsedOffset = this.getElapsedSeconds();
        this._isRunning = false;
    },
    // Add time to the total elapsed seconds of the stopwatch.
    addElapsed: function (offsetSeconds) {
        this._elapsedOffset += offsetSeconds;
    },
    _isRunning: false,
    _startingOffset: 0,
    _elapsedOffset: 0
};

// Class for animating any number or an object with numeric properties from a start value to an end value.
rin.internal.DoubleAnimation = function (duration, from, to) {
    this.duration = duration || this.duration; this.from = from; this.to = to; this.keyframe = null;
    rin.internal.debug.assert(this.duration >= 0);
    if (typeof from == "object" && typeof to == "object") {
        this.keyframe = {};
        for (var prop in from) {
            if (from.hasOwnProperty(prop) && typeof from[prop] == "number") this.keyframe[prop] = from[prop];
        }
    }
};
rin.internal.DoubleAnimation.prototype = {
    // Default values.
    duration: 1,
    from: 0,
    to: 1,
    keyframe: null,
    isCompleted: false,
    // Start the animation.
    begin: function () {
        this._startingOffset = Date.now() / 1000;
    },
    // Stop the animation prematurely.
    stop: function () {
        var offset = Date.now() / 1000 - this._startingOffset;
        this._startingOffset = -1;
        this.isCompleted = offset >= this.duration;
        this._endingValue = this.keyframe ? this._interpolateKeyframe(offset) : this._interpolateValue(offset, this.from, this.to);
    },
    // Get the current value of the animated values.
    getCurrentValue: function () {
        if (this._startingOffset === 0) return this.from;
        if (this._startingOffset < 0) return this._endingValue;
        if (this.duration === 0) return this.to;

        var offset = Date.now() / 1000 - this._startingOffset;
        if (offset >= this.duration) {
            this.stop();
            return this._endingValue;
        }

        return this.keyframe ? this._interpolateKeyframe(offset) : this._interpolateValue(offset, this.from, this.to);
    },
    // Get the the animated values at given time.
    getValueAt: function (offset) {
        if (offset <= 0) return this.from;
        if (this.duration === 0 || offset >= this.duration) return this.to;

        return this.keyframe ? this._interpolateKeyframe(offset) : this._interpolateValue(offset, this.from, this.to);
    },
    // Check if the animation is running.
    isRunning: function () {
        return this._startingOffset >= 0;
    },
    _interpolateKeyframe: function (offset) {
        for (var prop in this.keyframe) {
            this.keyframe[prop] = this._interpolateValue(offset, this.from[prop], this.to[prop]);
        }
        return this.keyframe;
    },
    _interpolateValue: function (offset, from, to) {
        return from + (to - from) * Math.min(offset, this.duration) / this.duration;
    },
    _startingOffset: 0,
    _endingValue: 0
};

// Storyboard to host animations.
rin.internal.Storyboard = function (doubleAnimation, onAnimate, onCompleted) {
    this._doubleAnimation = doubleAnimation; this.onAnimate = onAnimate;
    // Callback method which will be called at the end of the storyboard.
    this.onCompleted = onCompleted;
};

rin.internal.Storyboard.prototype = {
    // Callback method which will be called at the end of the storyboard.
    onCompleted: null,
    // Callback method which will be called at every frame of the storyboard with the updated values.
    onAnimate: null,
    // Start the storyboard.
    begin: function () {
        if (!this._doubleAnimation) throw new Error("No animation is specified.");
        this._doubleAnimation.begin();
        this._animate();
    },
    // Stop the storyboard.
    stop: function () {
        this._stopFlag = true;
        if (this._doubleAnimation) this._doubleAnimation.stop();
        if (typeof this.onCompleted == "function") this.onCompleted(this._doubleAnimation.isCompleted);
    },

    _animate: function () {
        if (this._stopFlag === false) {
            var val = this._doubleAnimation.getCurrentValue();

            if (typeof this.onAnimate == "function") this.onAnimate(val);
            if (!this._doubleAnimation.isRunning()) { // animation ended without stop being called
                this._stopFlag = true;
                if (typeof this.onCompleted == "function") this.onCompleted(this._doubleAnimation.isCompleted);
                return; // end animation loop
            }

            // Use rin shim for redraw callbacks.
            rin.internal.requestAnimFrame(this._animate.bind(this));
        }
    },
    _stopFlag: false,
    _doubleAnimation: null
};

// Basic implementation of promise pattern.
rin.internal.Promise = function (context) {
    "use strict";
    var callContext = context || this,
        self = this,
        onFailure = null,
        onComplete = null,
        nextPromise = null,
        promiseStates = {
            notStarted: "notStarted",
            completed: "completed",
            failed: "failed"
        },
        currentState = promiseStates.notStarted,
        moveToState = function (targetState, data) {
            switch (targetState) {
                case promiseStates.completed:
                    currentState = targetState;
                    if (typeof onComplete === 'function') {
                        var evalutedPromise = onComplete.call(callContext, data);
                        if (evalutedPromise && evalutedPromise instanceof rin.internal.Promise) {
                            evalutedPromise._setNextPromise(nextPromise);
                        } else {
                            if (nextPromise) {
                                nextPromise.markSuccess(data);
                            }
                        }
                    } else {
                        if (nextPromise) {
                            nextPromise.markSuccess(data);
                        }
                    }
                    return;
                case promiseStates.failed:
                    self.currentState = targetState;
                    if (typeof onFailure === 'function') {
                        onFailure.call(callContext, data);
                    }
                    if (nextPromise) {
                        nextPromise.markFailed(data);
                    }
                    return;
                case promiseStates.notStarted:
                    throw new Error("Invalid state transition: Cannot set the state to not-started");
            }
        };

    // Method which will be called after a promise has been satisfied.
    this.then = function (completed, failed) {
        if (completed instanceof rin.internal.Promise) {
            return completed;
        }
        if (!onComplete && !onFailure) {
            onComplete = completed;
            onFailure = failed;
        } else {
            if (!nextPromise) {
                nextPromise = new rin.internal.Promise(callContext);
            }
            nextPromise.then(completed, failed);
        }
        if (currentState === promiseStates.completed) {
            moveToState(promiseStates.completed);
        } else if (currentState === promiseStates.failed) {
            moveToState(promiseStates.failed);
        }
        return self;
    };

    //(Private) Method to set the next sequence of promises
    //Usage in external methods leads to indeterminate output
    this._setNextPromise = function (promise) {
        if (promise instanceof rin.internal.Promise) {
            if (!nextPromise) {
                nextPromise = promise;
            } else {
                nextPromise._setNextPromise(promise);
            }
        } else if (promise !== null && promise !== undefined) {
            throw new Error("parameter is not of type promise");
        }
        return self;
    };

    // Mark the promise as a success.
    this.markSuccess = function (data) {
        if (currentState === promiseStates.notStarted)
            moveToState(promiseStates.completed, data);
    };
    // Mark the promise as a failure.
    this.markFailed = function (error) {
        if (currentState === promiseStates.notStarted)
            moveToState(promiseStates.failed, error);
    };
};

// Module for deffered loading of resources to RIN.
rin.internal.DeferredLoader = function (refWindow) {
    "use strict";
    var head,
        body,
        browser,
        win = refWindow || window,
        doc = win.document,
        CONST_CSS_TIMEOUT_MS = 10000,
        CONST_CSS_TIME_BETWEEN_POLLS_MS = 100,
        loadedResources = {},
        // Adds a node to the document - To Do Optimize this for cross-browser and Win 8 standards.
        addElement = function (element, referenceNode, referenceType) {
            var refChild = referenceNode || doc.lastChild;
            switch (referenceType) {
                case "before":
                    if (window.MSApp !== undefined && window.MSApp.execUnsafeLocalFunction) {
                        return window.MSApp.execUnsafeLocalFunction(function () {
                            doc.insertBefore(element, refChild);
                        });
                    } else {
                        doc.insertBefore(element, refChild);
                    }
                    break;
                default:
                    if (window.MSApp !== undefined && window.MSApp.execUnsafeLocalFunction) {
                        return window.MSApp.execUnsafeLocalFunction(function () {
                            refChild.parentNode.appendChild(element);
                        });
                    }
                    else {
                        refChild.parentNode.appendChild(element);
                    }
                    break;
            }
        },
        // Adds a node to the document.
        createAndAddElement = function (nodeName, attributes, referenceNode, referenceType) {
            var element = doc.createElement(nodeName),
                attrs = attributes || [],
                attributeName;
            for (attributeName in attrs) {
                if (attrs.hasOwnProperty(attributeName)) {
                    element.setAttribute(attributeName, attrs[attributeName]);
                }
            }
            addElement(element, referenceNode, referenceType);
            return element;
        },
        // Gets the first matching node by tag name or undefined.
        getFirstNodeByTagNameSafe = function (nodeName) {
            var nodes = doc.getElementsByTagName(nodeName);
            return nodes && (nodes.length > 0 ? nodes[0] : undefined);
        },
        // Gets the body node or undefined.
        getBodyNode = function () {
            body = body || doc.body || getFirstNodeByTagNameSafe("body");
            return body;
        },
        // Gets the head node or undefined.
        getHeadNode = function () {
            head = head || doc.head || getFirstNodeByTagNameSafe("head") || createAndAddElement("head", null, getBodyNode(), "before");
            return head;
        },
        // Initializes browser type object.
        getBrowser = function () {
            if (!browser) {
                var agent = win.navigator.userAgent;
                browser = {};
                (browser.chrome = (/AppleWebKit\//i.test(agent) && /Chrome/i.test(agent)))
                || (browser.webkit = /AppleWebKit\//i.test(agent))
                || (browser.win8 = window.MSApp)
                || (browser.ie10 = (/MSIE 10/i.test(agent) || (document.documentMode && document.documentMode >= 9)))
                || (browser.ie = /MSIE/i.test(agent))
                || (browser.other = true);
            }
            return browser;
        },
        // Gets the data specified in the Url.
        getSource = function (url, callback) {
            var xmlhttp, promise;
            if (loadedResources[url]) {
                return loadedResources[url].promise;
            }
            else {
                promise = new rin.internal.Promise();
                loadedResources[url] = { promise: promise };
                if (win.XMLHttpRequest) {
                    xmlhttp = new win.XMLHttpRequest();
                }
                else {
                    xmlhttp = new win.ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function () {
                    var data;
                    if (xmlhttp.readyState === 4) {
                        if (xmlhttp.status === 200) {
                            data = xmlhttp.responseText;
                            loadedResources[url].data = data;
                            if (typeof callback === 'function') {
                                callback(data);
                            }
                            promise.markSuccess(data);
                        } else {
                            data = xmlhttp.statusText;
                            loadedResources[url].data = data;
                            promise.markFailed(data);
                        }
                    }
                };
                xmlhttp.open("GET", url, true);
                xmlhttp.send(null);
            }
            return promise;
        },
        getDom = function (textData, mimeType) {
            var domParser = new win.DOMParser(),
                dom = domParser.parseFromString(textData, mimeType);
            return dom;
        },
        getHtmlDom = function (textData) {
            return rin.util.createElementWithHtml(textData).childNodes;
        },
        scriptReferenceNode = getHeadNode().lastChild,
        cssReferenceNode = scriptReferenceNode,
        htmlTemplateReferenceNode = scriptReferenceNode,
        getUrlType = function (url) {
            var type;
            if (/\.css$/i.test(url)) {
                type = "css";
            }
            else if (/\.js$/i.test(url)) {
                type = "script";
            }
            else if (/\.htm?$/i.test(url)) {
                type = "html";
            }
            else {
                type = "unknown";
            }
            return type;
        },
        // Checks of the style sheet is loaded.
        isStylesheetLoaded = function (cssRef) {
            var stylesheets = doc.styleSheets,
                i = stylesheets.length - 1;
            while (i >= 0 && stylesheets[i].href !== cssRef) {
                i -= 1;
            }
            return i >= 0;
        },
        // Poll to see if stylesheet is loaded.
        pollStyleSheetLoaded = function (node, promise, polledTime) {
            if (node.href && isStylesheetLoaded(node.href)) {
                if (promise instanceof rin.internal.Promise) { promise.markSuccess(); }
                return;
            }
            if ((polledTime || 0) >= CONST_CSS_TIMEOUT_MS) {
                if (promise instanceof rin.internal.Promise) { promise.markFailed(); }
                return;
            }
            win.setTimeout(function () { pollStyleSheetLoaded(node, promise, (polledTime || 0) + CONST_CSS_TIME_BETWEEN_POLLS_MS); }, CONST_CSS_TIME_BETWEEN_POLLS_MS);
        },
        // Sets the onload complete method for the node based on node name.
        initOnLoadComplete = function (node, promise) {
            getBrowser();
            if (browser.ie && node.nodeName.toLowerCase() === 'script') {
                node.onload = node.onreadystatechange = function () {
                    if (/loaded|complete/.test(node.readyState)) {
                        node.onload = node.onreadystatechange = null;
                        if (promise instanceof rin.internal.Promise) { promise.markSuccess(); }
                    }
                };
            }
            else if (browser.webkit && node.nodeName.toLowerCase() === 'link') {
                //Only safari doesn't fire onload event for CSS
                //We need to poll the style sheet length for this
                pollStyleSheetLoaded(node, promise);
            }
            else {
                node.onload = function () {
                    if (promise instanceof rin.internal.Promise) { promise.markSuccess(); }
                };
                node.onerror = function () {
                    if (promise instanceof rin.internal.Promise) { promise.markFailed(); }
                };
            }
        },
        // Loads a script by inserting script tag.
        loadScript = function (scriptSrc, checkerFunction) {
            var scriptNode, promise = new rin.internal.Promise(), isScriptLoaded = false;
            try {
                isScriptLoaded = checkerFunction != undefined && typeof checkerFunction === "function" && checkerFunction();
            }
            catch (e) {
                isScriptLoaded = false;
            }
            if (!isScriptLoaded) {
                scriptNode = createAndAddElement("script", { type: "text/javascript" }, scriptReferenceNode);
                initOnLoadComplete(scriptNode, promise);
                scriptNode.src = scriptSrc;
            }
            else {
                promise.markSuccess();
            }
            return promise;
        },
        // Loads a stylesheet by inserting link tag.
        loadCss = function (cssSrc) {
            var linkNode,
                promise = new rin.internal.Promise();
            if (!isStylesheetLoaded(cssSrc)) {
                linkNode = createAndAddElement("link", { rel: "stylesheet" }, cssReferenceNode);
                initOnLoadComplete(linkNode, promise);
                linkNode.href = cssSrc;
            }
            else {
                promise.markSuccess();
            }
            return promise;
        },
        // Loads a templated html and adds the template to the document.
        loadTemplateHtml = function (htmlSrc) {
            var promise = getSource(htmlSrc,
                            function (data) {
                                var domNodes = getHtmlDom(data), i,
                                    len = domNodes.length,
                                    nodeToAdd,
                                    referenceNode = htmlTemplateReferenceNode;
                                for (i = 0; i < len; i += 1) {
                                    //Loop through all the first-level tags
                                    nodeToAdd = domNodes[i];
                                    if (nodeToAdd && nodeToAdd.nodeType && nodeToAdd.nodeType === nodeToAdd.ELEMENT_NODE) {
                                        addElement(nodeToAdd, referenceNode);
                                        referenceNode = nodeToAdd; // The next node to be added should be after this
                                        i -= 1;
                                    }
                                }
                            });
            return promise;
        },
        // Loads any other type of resource and adds it to the loadedSources. To be used for resources other than script, css and templated html.
        loadOtherResource = function (src) {
            var promise = getSource(src);
            return promise;
        },
        // Loads any type of resource.
        loadResource = function (src) {
            var tempSource = src,
            url = src;
            if (typeof url === 'string') {
                url = { src: tempSource };
            }
            if (!url.type) {
                url.type = getUrlType(url.src);
            }
            switch (url.type.toLowerCase()) {
                case "script":
                    return loadScript(url.src, url.loadChecker);
                case "css":
                    return loadCss(url.src);
                case "html":
                    return loadTemplateHtml(url.src);
                default:
                    return loadOtherResource(url.src);
            }
        };

    // Loads the given url(s) in parallel. The promise returned would fire even if atleast one succeeds and others fail.
    this.parallelLoader = function (urls) {
        //To Do - optimize for urls in queue or already loaded
        var promise = new rin.internal.Promise(),
            sources = (urls instanceof Array ? urls : [urls]),
            sourcesLen = sources.length,
            callCount = sourcesLen,
            successCount = 0,
            i,
            callComplete = function () {
                callCount -= 1;
                if (callCount === 0) {
                    successCount > 0 ? promise.markSuccess() : promise.markFailed();
                }
            },
            onSuccess = function () {
                successCount += 1;
                callComplete();
            },
            onFailure = function () {
                callComplete();
            };
        for (i = 0; i < sourcesLen; i += 1) {
            loadResource(sources[i]).then(onSuccess, onFailure);
        }
        return promise;
    };
    // Loads the given url(s) in sequence. The promise returned would fire only if all succeeds.
    this.sequentialLoader = function (urls) {
        var sources = (urls instanceof Array ? urls.slice() : [urls]),
            currentSource,
            len = sources.length,
            promise,
            i;
        for (i = 0; i < len; i += 1) {
            currentSource = sources[i];
            if (promise) {
                promise.then(function () {
                    currentSource = sources.shift();
                    promise = loadResource(currentSource);
                    return promise;
                });
            }
            else {
                currentSource = sources.shift();
                promise = loadResource(currentSource);
            }
        }
        return promise;
    };
    this.otherResources = loadedResources;
    // Load all rin required resources and dependancies.
    this.loadSystemResources = function (systemRoot) {
        var self = this,
            func = function () {
                var promise;
                rin.internal.systemResourcesProcessed = rin.internal.systemResourcesProcessed || false;
                //To Do - Need to look at replacing these with some configuration and letting the ES developer to load his custom libraries.
                if (!rin.internal.systemResourcesProcessed) {
                    promise = self.parallelLoader([
                            { src: "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.1.min.js", loadChecker: function () { return window.jQuery !== undefined; } },
                            { src: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js", loadChecker: function () { return window.ko !== undefined; } }
                    ])
                    .then(function () {
                        return self.sequentialLoader([
                            { src: rin.util.combinePathElements(systemRoot, 'lib/jquery.easing.1.3.js'), loadChecker: function () { return window.jQuery.easing["jswing"] !== undefined; } },
                            { src: rin.util.combinePathElements(systemRoot, 'lib/jquery.pxtouch.min.js'), loadChecker: function () { return window.PxTouch !== undefined; } },
                            { src: "/scripts/extensions/rin-scripts/rin-experiences-1.0.js", loadChecker: function () { return rin.experiences !== undefined; } }
                        ]);
                    }).then(function () {
                        rin.internal.systemResourcesProcessed = true;
                    });
                }
                else {
                    promise = new rin.internal.Promise(); //A dummy promise with success marked
                    promise.markSuccess();
                }
                return promise;
            };
        if (window.MSApp !== undefined && window.MSApp.execUnsafeLocalFunction) {
            return window.MSApp.execUnsafeLocalFunction(func);
        }
        return func();
    };
    // Load all theme specific resources.
    this.loadAllThemeResources = function (systemRoot) {
        var self = this,
            func = function () {
                return self.parallelLoader([
                rin.util.combinePathElements(systemRoot, 'rin.css'),
                rin.util.combinePathElements(systemRoot, 'rinTemplates.htm')
                ]);
            };
        if (window.MSApp !== undefined && window.MSApp.execUnsafeLocalFunction) {
            return window.MSApp.execUnsafeLocalFunction(func);
        }
        return func();
    };
};
/// <reference path="Common.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="../contracts/IExperienceStream.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Class that describes an experienceStream with its metadata such as id, offsets, zIndex etc.
rin.internal.ESItem = function (id, esData, experienceStream, zIndex, beginOffset, endOffset, experienceStreamLayer) {
    this.id = id;
    this.esData = esData;
    this.experienceStream = experienceStream;
    this.beginOffset = beginOffset || 0;
    this.endOffset = endOffset || Infinity;
    this.experienceStreamLayer = experienceStreamLayer || rin.contracts.experienceStreamLayer.background;
    this.zIndex = zIndex || 0;
    this.providerId = "UnknownOrSystem";
}

rin.internal.ESItem.prototype = {
    id: "",
    esData: null,
    experienceStream: rin.contracts.IExperienceStream,
    beginOffset: 0,
    endOffset: 0,
    experienceStreamLayer: null,
    zIndex: 0,
    screenPlayInfo: null,
    _isLoadCalled: false,

    // string description used in event logs and in debugging.
    toString: function () {
        return "{0} ({1}:{2}-{3}:{4}) ES:{5}".rinFormat(this.id,
            this.beginOffset / 60, this.beginOffset % 60,
            this.endOffset / 60, this.endOffset % 60,
            this.experienceStream.state);
    }
};
/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />
/// <reference path="../core/OrchestratorProxy.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Class that manages list of ESItems in given screenPlayId. This class knows what to do when screenplay changes, when current experience streams change etc. 
// It calls preloader, stageAreaManager and orchestrator as needed.
rin.internal.ESItemsManager = function () {
    var self = this;
    this.esStateChangedEventHook = function (eventArgs) { self._onESStateChangedEvent(eventArgs) }; // a simple function that wraps _onESStateChangedEvent with "self" pointer.
    this._screenPlayInterpreterCache = {};
    this._esItemCache = {};
}

rin.internal.ESItemsManager.prototype = {
    _systemESItems: null,
    _orchestrator: null,
    _esTimerES: null,
    _screenPlayES: null,
    _currentESItems: null,
    _esItemCache: null,
    _screenPlayInterpreterCache: null,

    bufferingES: null,
    preloaderES: null,
    screenPlayInterpreter: null,

    esTimer: null,
    preloaderESItem: null,
    esStateChangedEventHook: null, //to be defined in constructor

    // Initialize the item manager and all its internal dependancies.
    initialize: function (rinData, orchestrator, screenPlayId) {
        this._orchestrator = orchestrator;
        this._getSystemESItems();

        if (this.screenPlayInterpreter == null) {
            this.screenPlayInterpreter = this._getScreenPlayInterpreter(screenPlayId || rinData.defaultScreenplayId, rinData.providers[rinData.screenplayProviderId]);
        }

        this._cacheAllScreenPlays();
        this.preloaderES.initialize(this._orchestrator, this._orchestrator.playerControl.stageControl, this.screenPlayInterpreter, this._allOrderedESItems);

        this._currentESItems = new rin.internal.List();
        this.onCurrentExperienceStreamsChanged(this._systemESItems, null, this._systemESItems);
    },

    // Unload all ESes.
    unload: function () {
        if (this._currentESItems && this._currentESItems !== null) {
            this._orchestrator.currentESItemsChanged.publish({ "addedItems": null, "removedItems": this._currentESItems, "currentList": null, "isSeek": true });
            this._currentESItems.foreach(function (item) {
                item.experienceStream.stateChangedEvent.unsubscribe(this.esStateChangedEventHook)
            }, this);
        }

        if (this.screenPlayInterpreter && this.screenPlayInterpreter !== null) {
            this.screenPlayInterpreter.getESItems().foreach(function (item) {
                if (this._orchestrator.isExperienceStreamLoaded(item.id))
                    item.experienceStream.unload();
            }, this);
        }

        this._systemESItems.foreach(function (item) {
            if (typeof (item.experienceStream.unload) == "function") item.experienceStream.unload();
        });
    },

    // Switches hypertimeline from current screenPlayId to new screenPlayId
    switchHyperTimeline: function (screenPlayId) {
        if (!this.screenPlayInterpreter && this.screenPlayInterpreter.id == screenPlayId) return; // we are in target screenplay already
        if (!this._orchestrator.isValidScreenPlayId(screenPlayId)) return;

        this.screenPlayInterpreter = this._getScreenPlayInterpreter(screenPlayId);

        var narrativeInfo = this._orchestrator.getNarrativeInfo();
        if (this._orchestrator.isDefaultScreenPlayId(screenPlayId)) {
            narrativeInfo.totalDuration = narrativeInfo.narrativeData.estimatedDuration;
        }
        else {
            narrativeInfo.totalDuration = this.screenPlayInterpreter.getEndTime();
        }

        this._esTimerES.load();
        this.preloaderES.updateScreenPlay(this.screenPlayInterpreter);

        // Apply screenplay attributes for all ESs in new screenplay
        this.screenPlayInterpreter.getESItems().foreach(function (es) { this.screenPlayInterpreter.setScreenPlayAttributes(es); }.bind(this));
    },

    // Creates a new ESItem for given provider info, esData & orchestratorProxy, by calling esFactory or by returning a cached instance.
    createESItem: function (providerName, providerVersion, esData, proxy) {
        var esId = esData.id;
        var esItem = this._esItemCache[esId];
        if (esItem) return esItem;

        var factoryFunction = this._getFactory(providerName, providerVersion);
        rin.internal.debug.assert(factoryFunction != null, "could not find factory function");

        if (factoryFunction) {
            esItem = new rin.internal.ESItem(esId, esData);
            var orchestratorProxy = proxy || new rin.internal.OrchestratorProxy(this._orchestrator);
            esItem.experienceStream = factoryFunction(orchestratorProxy, esData);
            rin.internal.debug.assert(esItem.experienceStream != null, "ES Item has no ES");
            orchestratorProxy.init(esItem.experienceStream);
            this._esItemCache[esId] = esItem;
            return esItem;
        };
        rin.internal.debug.assert(false, "Could not create required ES");
        return null;
    },

    // Returns list of ESItems staged at current time
    getCurrentESItems: function () {
        return this._currentESItems;
    },

    // Returns true if all current ESItems are in ready or error state.
    areAllESsReady: function () {
        return !this.getCurrentESItems().firstOrDefault(function (es) { return es.experienceStream.getState() == rin.contracts.experienceStreamState.buffering });
    },

    // Updates current ESs list to match the provided offset.
    updateCurrentESs: function (offset, previousTimeOffset) {
        var currentList = this.getCurrentESItems();
        var newList = this.screenPlayInterpreter.getESItems(offset).concat(this._systemESItems);
        var addedItems = newList.except(currentList);
        var removedItems = currentList.except(newList);

        this.onCurrentExperienceStreamsChanged(addedItems, removedItems, newList, true, previousTimeOffset);
    },

    // Method called when the list of ESes on screen changes.
    onCurrentExperienceStreamsChanged: function (addedItems, removedItems, currentList, isSeek, previousTimeOffset) {
        this._currentESItems = currentList;
        this._orchestrator.stageAreaManager.onCurrentExperienceStreamsChanged(addedItems, removedItems, currentList, isSeek);
        this._orchestrator.currentESItemsChanged.publish({ "addedItems": addedItems, "removedItems": removedItems, "currentList": currentList, "isSeek": isSeek });
        this._orchestrator.eventLogger.logEvent("");

        var wereItemsAdded = (addedItems && addedItems.constructor == Array && addedItems.length > 0);
        var wereItemsRemoved = (removedItems && removedItems.constructor == Array && removedItems.length > 0);
        var self = this;

        // Manage all newly added items.
        if (wereItemsAdded) {
            for (var i = 0, len = addedItems.length; i < len; i++) {
                if (removedItems && removedItems.any(function (item) { return item.experienceStream == addedItems[i].experienceStream })) continue; // These are in removed items also, so skip instead of re-adding.

                var item = addedItems[i];
                item.experienceStream.stateChangedEvent.subscribe(this.esStateChangedEventHook, "ESItemsManager");
                this._setNewlyAddedState(item);
                if (typeof (item.experienceStream.addedToStage) == "function")
                    item.experienceStream.addedToStage();

                var currentTime = this._orchestrator.getCurrentLogicalTimeOffset();
                var epsilon = 0.1;
                rin.internal.debug.assert((currentTime + epsilon) >= item.beginOffset && (currentTime - epsilon) <= item.endOffset, "item added to stage beyond its life time");
                this._orchestrator.eventLogger.logEvent("ES {0} added at {1} time scheduled {2}", item.id,
                     currentTime, item.beginOffset);
            }
        }
        // Managed any items removed recently.
        if (wereItemsRemoved) {
            for (var i = 0, len = removedItems.length; i < len; i++) {
                if (addedItems && addedItems.any(function (item) { return item.experienceStream == removedItems[i].experienceStream })) continue; // No need to remove because it is there for re-add

                var item = removedItems[i];
                item.experienceStream.stateChangedEvent.unsubscribe("ESItemsManager");
                item.experienceStream.pause(this._orchestrator._getESItemRelativeOffset(item, previousTimeOffset));

                if (typeof (item.experienceStream.removedFromStage) == "function")
                    item.experienceStream.removedFromStage();

                this._orchestrator.eventLogger.logEvent("ES {0} removed at {1} time scheduled {2}", item.id,
                    this._orchestrator.getCurrentLogicalTimeOffset(), item.endOffset);
            }
        }

        // If there were any items added or removed, check for ES status and show buffering ES if necessary.
        if (wereItemsAdded || wereItemsRemoved) this._checkESStatusesAsync();
    },


    _getScreenPlayInterpreter: function (screenPlayId, screenplayProviderInfo) {
        var screenPlayInterpreter = this._screenPlayInterpreterCache[screenPlayId];
        if (!screenPlayInterpreter) {
            screenPlayInterpreter = new rin.internal.DefaultScreenPlayInterpreter(); //V2 need to instantiate the provider based on provider info
            var segmentInfo = this._orchestrator.getSegmentInfo();
            if (segmentInfo.screenplays[screenPlayId]) {
                screenPlayInterpreter.initialize(screenPlayId, segmentInfo, this._orchestrator);
            } else {
                rin.internal.debug.write("Unable to find the screenplay with id " + screenPlayId);
            }
            this._screenPlayInterpreterCache[screenPlayId] = screenPlayInterpreter;
        }
        return screenPlayInterpreter;
    },

    _allScreenPlayIds: null,
    _allOrderedESItems: null,

    _cacheAllScreenPlays: function () {
        if (this._allScreenPlayIds) return;
        this._allScreenPlayIds = new rin.internal.List();
        this._allOrderedESItems = new rin.internal.List();

        for (var screenPlayId in this._orchestrator._rinData.screenplays) {
            this._allScreenPlayIds.push(screenPlayId);
            var screenPlayInterpreter = this._getScreenPlayInterpreter(screenPlayId)
            Array.prototype.push.apply(this._allOrderedESItems, screenPlayInterpreter.getESItems())
        };
    },

    _setNewlyAddedState: function (addedES) {
        this.screenPlayInterpreter.setScreenPlayAttributes(addedES);

        var playerState = this._orchestrator.getPlayerState();
        if (playerState != rin.contracts.playerState.inTransition) {
            var actionDebugInfo = "none";
            switch (playerState) {
                case rin.contracts.playerState.pausedForBuffering:
                case rin.contracts.playerState.pausedForExplore:
                    var relativeOffset = this._orchestrator._getESItemRelativeOffset(addedES);
                    addedES.experienceStream.pause(relativeOffset, addedES.currentExperienceStreamId);
                    actionDebugInfo = "paused";
                    break;

                case rin.contracts.playerState.playing:
                    var esState = addedES.experienceStream.getState();

                    if (esState == rin.contracts.experienceStreamState.ready) {
                        var relativeOffset = this._orchestrator._getESItemRelativeOffset(addedES);
                        addedES.experienceStream.play(relativeOffset, addedES.currentExperienceStreamId);
                        actionDebugInfo = "played";
                    }
                    else if (esState == rin.contracts.experienceStreamState.buffering) {
                        this._orchestrator._pauseForBuffering();
                        actionDebugInfo = "narrative paused";
                    }
                    break;
                case rin.contracts.playerState.stopped:
                    break;

                default:
                    rin.internal.debug.assert(false, "Unknown player state encountered");
                    break;
            }
        }
        this._orchestrator.eventLogger.logEvent("ES {0} added action: {1}", addedES.id, actionDebugInfo);
    },

    _onESStateChangedEvent: function (esStateChangedEventArgs) {
        if (esStateChangedEventArgs.toState == rin.contracts.experienceStreamState.error) {
            this._orchestrator.eventLogger.logErrorEvent("!!!!!ES {0} went to error state.".rinFormat(esStateChangedEventArgs.source));
        }
        this._checkESStatusesAsync();
    },
    _checkESStatusesAsync: function () {
        var self = this;
        setTimeout(function () { self._checkESStatuses() }, 0);
    },
    _checkESStatuses: function () {
        var areAllESReady = this.areAllESsReady();
        this._orchestrator.setIsPlayerReady(areAllESReady);

        var playerState = this._orchestrator.getPlayerState();
        if (playerState == rin.contracts.playerState.stopped) return;

        if (areAllESReady) {
            if (this._orchestrator.goalPlayerState == rin.contracts.playerState.playing && playerState != rin.contracts.playerState.playing) {
                this._orchestrator.play();
            }
            else if (this._orchestrator.goalPlayerState == rin.contracts.playerState.pausedForExplore && playerState != rin.contracts.playerState.pausedForExplore) {
                this._orchestrator.pause();
            }
        }

        if (!areAllESReady && playerState == rin.contracts.playerState.playing) {
            this._orchestrator._pauseForBuffering();
        }
    },

    _getSystemESItems: function () {
        this._systemESItems = new rin.internal.List();

        //todo: player controller es

        if (!this.bufferingES) {
            this.bufferingES = new rin.internal.DefaultBufferingES(this._orchestrator);
        }

        var bufferingESItem = new rin.internal.ESItem("BufferingES", null, this.bufferingES, 100001);
        this._systemESItems.push(bufferingESItem);

        if (!this.preloaderES) {
            this.preloaderES = new rin.internal.DefaultPreloaderES();
        }
        this.preloaderESItem = new rin.internal.ESItem("PreloaderES", null, this.preloaderES);
        this._systemESItems.push(this.preloaderESItem);

        this._esTimerES = new rin.internal.ESTimerES(this._orchestrator, this);
        this.esTimer = this._esTimerES.esTimer;
        var esTimerItem = new rin.internal.ESItem("ESTimerES", null, this._esTimerES);
        this._systemESItems.push(esTimerItem);

        if (this._orchestrator.playerConfiguration.playerControllerES && !this._orchestrator.playerConfiguration.hideAllControllers && !this._orchestrator.playerConfiguration.hideDefaultController) {
            var controllerItem = new rin.internal.ESItem("PlayerController", null, this._orchestrator.playerConfiguration.playerControllerES);
            this._systemESItems.push(controllerItem);
        }

    },

    _getFactory: function (providerTypeName, providerVersion) {
        return rin.ext.getFactory(rin.contracts.systemFactoryTypes.esFactory, providerTypeName, providerVersion);
    }


};
/// <reference path="Common.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="ESItem.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="ScreenPlayInterpreter.js"/>
/// <reference path="Orchestrator.js"/>
/// <reference path="ESItemsManager.js"/>
/// <reference path="EventLogger.js"/>

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Timer implementation for maintaining the narrative timeline.
rin.internal.ESTimer = function (orchestrator, esItemsManager) {
    this._orchestrator = orchestrator;
    this._esItemsManager = esItemsManager;
    this.taskTimer = new rin.internal.TaskTimer(); // Internal timer for triggering tasks at specific time intervals.
};

rin.internal.ESTimer.prototype = {
    taskTimer: null,
    // Load ES items from the current screenplay and initialize the timer.
    loadESItmes: function () {
        if (this.taskTimer) this.taskTimer.pause();

        var esItems = this._esItemsManager.screenPlayInterpreter.getESItems();
        this.taskTimer = new rin.internal.TaskTimer();
        // Add item to task list.
        for (var i = 0; i < esItems.length; i++) {
            var item = esItems[i];
            this.taskTimer.add(item.beginOffset, new rin.internal.ESTimerItem(item, true));
            // Check for a valid end offset.
            if (item.endOffset != Infinity) this.taskTimer.add(item.endOffset, new rin.internal.ESTimerItem(item, false));
            this._orchestrator.eventLogger.logEvent("ESTimer: add item {0} for {1}-{2}", item.id, item.beginOffset, item.endOffset);
        }

        // Add end indicator. This will be trigered after the timeline is complete.
        var screenPlayEndTime = this._esItemsManager.screenPlayInterpreter.getEndTime();
        this.taskTimer.add(screenPlayEndTime, new rin.internal.ESTimerItem(this._endIndicatorItem, false));

        // This indicator will be triggered before triggering end indicator.
        var beforeEndTime = screenPlayEndTime - this._beforeEndNotificationTime;
        this.taskTimer.add(beforeEndTime, new rin.internal.ESTimerItem(this._beforeEndIndicatorItem, false));

        var self = this;
        this.taskTimer.taskTriggeredEvent.subscribe(function (triggeredItems) { self._taskTimer_taskTriggered(triggeredItems) });
    },

    // Method called every time a task is triggered by the timer.
    _taskTimer_taskTriggered: function (triggeredItems) {
        var addedESItems = new rin.internal.List();
        var removedESItems = new rin.internal.List();

        // Check all triggered items and update addedItems and removedItems list.
        for (var i = 0, len = triggeredItems.length; i < len; i++) {
            var item = triggeredItems[i];
            if (item.isEntry) {
                addedESItems.push(item.esItem);
                this._orchestrator.eventLogger.logEvent("ESTimer Trigger Add: {0} at {1} scheduled {2}", item.esItem.id, this.taskTimer.getCurrentTimeOffset(), item.esItem.beginOffset);
            }
            else {
                removedESItems.push(item.esItem);
                this._orchestrator.eventLogger.logEvent("ESTimer Trigger Rem: {0} at {1} scheduled {2}", item.esItem.id, this.taskTimer.getCurrentTimeOffset(), item.esItem.beginOffset);
            }
        }

        var currentESItems = this._esItemsManager.getCurrentESItems();
        addedESItems = addedESItems.except(currentESItems);
        var newESItems = addedESItems.concat(currentESItems).distinct().except(removedESItems);

        // Make sure indicator items are not removed.
        if (removedESItems.contains(this._beforeEndIndicatorItem)) {
            this._orchestrator._onBeforeScreenPlayEnd();
            removedESItems.remove(this._beforeEndIndicatorItem);
        }

        if (addedESItems.length == 0 && removedESItems.length == 0) return; //No changes, quit early.

        // Check if the task is an end indicator.
        var isScreenPlayEnding = removedESItems.contains(this._endIndicatorItem);
        if (isScreenPlayEnding) {
            removedESItems.remove(this._endIndicatorItem);
            var handled = this._orchestrator._onScreenPlayEnding();
            if (handled) return;
        }

        // Raise ES list changed event.
        this._esItemsManager.onCurrentExperienceStreamsChanged(addedESItems, removedESItems, newESItems, false);
        this._orchestrator._seekESItems(addedESItems, this._orchestrator.getCurrentLogicalTimeOffset());

        if (isScreenPlayEnding) {
            this._orchestrator._onScreenPlayEnded();
        }
    },
    _esItemsManager: null, //new rin.internal.ESItemsManager(), 
    _orchestrator: null, //new rin.internal.Orchestrator()
    _beforeEndIndicatorItem: new rin.internal.ESItem("BeforeEndIndicatorItem"),
    _endIndicatorItem: new rin.internal.ESItem("EndIndicatorItem"),
    _beforeEndNotificationTime: 0.2
};

// Format for a timer item to be stored in the task timer.
rin.internal.ESTimerItem = function (esItem, isEntry) {
    this.esItem = esItem; this.isEntry = isEntry;
};
/// <reference path="Common.js"/>

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.EventLogger = function () { }

rin.internal.EventLogger.prototype = {
    logEvent: function (eventInfoFormat, params) {
        var eventInfo = this.formatString(arguments);
        rin.internal.debug.write(eventInfo);
    },

    logErrorEvent: function (eventInfoFormat, params) {
        var eventInfo = this.formatString(arguments);
        rin.internal.debug.write(eventInfo);
    },

    logBeginEvent: function (eventName, eventInfoFormat, params) {
        rin.internal.debug.write("Begin: " + eventName);
        return { begin: Date.now(), name: eventName };
    },

    logEndEvent: function (beginEventToken, eventInfoFormat, params) {
        var eventDuration = (Date.now() - beginEventToken.begin) / 1000;
        rin.internal.debug.write("End event {0}. Duration {1}. {2}".rinFormat(beginEventToken.name, eventDuration, eventInfoFormat));
    },

    toString: function () {
    },

    _getIndent: function () {
    },

    formatString: function (argsArray, textParamIndex) {
        textParamIndex = textParamIndex || 0;
        var text = argsArray[textParamIndex];
        return text.replace(/\{(\d+)\}/g, function (matchedPattern, matchedValue) {
            return argsArray[parseInt(matchedValue) + textParamIndex + 1];
        });
    },
    _indentLevel: 0,
    _logBuilder: "",
    _errorLogBuilder: ""
};

/// <reference path="Common.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="ESItem.js"/>
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="ScreenPlayInterpreter.js"/>
/// <reference path="EventLogger.js"/>
/// <reference path="../core/PlayerConfiguration.js"/>
/// <reference path="../core/PlayerControl.js"/>
/// <reference path="../core/ResourcesResolver.js"/>
/// <reference path="StageAreaManager.js"/>

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Orchestrator controls the entire narrative like play/pause/seek etc. It acts as a mediator for many communications. Its the backbone of a narrative.
rin.internal.Orchestrator = function (playerControl, playerConfiguration) {
    this.playerStateChangedEvent = new rin.contracts.Event(); // Raised when the player state changes. Bufferring/Playing/Error etc..
    this.isPlayerReadyChangedEvent = new rin.contracts.Event(); // Raised when player ready state is toggled.
    this.narrativeLoadedEvent = new rin.contracts.Event();
    this.narrativeSeekedEvent = new rin.contracts.Event();
    this.playerESEvent = new rin.contracts.Event(); // Player ES events is a generic set of events which can be used for custom purposes like ES to ES communication.
    this.currentESItemsChanged = new rin.contracts.Event(); // Raised when any ES is added or removed from stage.

    this.playerControl = playerControl;
    this.playerConfiguration = playerConfiguration;
    this._resourcesResolver = new rin.internal.ResourcesResolver(playerConfiguration);
    this._esLoadedInfo = {};

    this.stageAreaManager = new rin.internal.StageAreaManager(this, playerControl.stageControl);
    this.eventLogger = new rin.internal.EventLogger();
};


rin.internal.Orchestrator.prototype = {
    // Gets an instance of the resource resolver.
    getResourceResolver: function () {
        return this._resourcesResolver;
    },

    // Gets the narartive info object.
    getNarrativeInfo: function () {
        return this._narrativeInfo;
    },

    // Gets the segment info object.
    getSegmentInfo: function () {
        return this._rinData;
    },

    // Plays the narrative from the specified offset of the screenplay mentioned.
    play: function (offset, screenPlayId, onComplete) {
        if (typeof this._lastPlayCallback == "function" && typeof onComplete == "function") // Cancel existing call back with 'false' flag if a new callback is requested.
            this._lastPlayCallback(false);
        if (typeof onComplete == "function")
            this._lastPlayCallback = onComplete;

        rin.internal.debug.assert(this._isNarrativeLoaded, "Narrative is not loaded");
        // Make sure narrative is loaded before executing play.
        if (!this._isNarrativeLoaded) {
            this._throwInvalidOperation("Invalid operation: Play should be called only after loading narrative.");
            return;
        }

        var playerState = this.getPlayerState();
        if (playerState == rin.contracts.playerState.inTransition) return;

        // Validate the offset.
        var previousTimeOffset = this.getCurrentLogicalTimeOffset();
        var isValidOffset = typeof (offset) == "number" && offset >= 0;
        offset = isValidOffset ? offset : previousTimeOffset;
        if (offset >= this._narrativeInfo.totalDuration) offset = 0; //TODO: Post everest, clamp it at total duration.

        screenPlayId = screenPlayId || this.currentScreenPlayId;

        // Round off the offset to a delta to avoid minute seeks.
        var epsilon = .1;
        var isCurrentScreenPlayId = this.currentScreenPlayId == screenPlayId;
        var isOffsetCurrentTime = (Math.abs(previousTimeOffset - offset) < epsilon) && isCurrentScreenPlayId;

        if (playerState == rin.contracts.playerState.playing && isOffsetCurrentTime && isCurrentScreenPlayId) return;

        var eventToken = this.eventLogger.logBeginEvent("play");

        // Set the state to transition for now as some ESes might take time to seek or load.
        this.setPlayerState(rin.contracts.playerState.inTransition);

        try {
            // Switch screenplays if the requested one is different than the one being played.
            if (!isCurrentScreenPlayId && this.isValidScreenPlayId(screenPlayId)) {
                this.switchHyperTimeline(screenPlayId);
            }

            // Seek all ESes to the offset.
            if (!isOffsetCurrentTime) {
                this.esItemsManager.esTimer.taskTimer.seek(offset);
                this.esItemsManager.updateCurrentESs(offset, previousTimeOffset);
                this.narrativeSeekedEvent.publish({ "seekTime": offset, "screenPlayId": screenPlayId });
            }

            // Play all ESes.
            if (this.esItemsManager.areAllESsReady()) {
                this._playCurrentESs(offset, screenPlayId);
            }
        }
        finally {
            // Wait for all ESes to be ready and set the state to playing. Set to buffering mode till then.
            this.goalPlayerState = rin.contracts.playerState.playing;
            if (!this.esItemsManager.areAllESsReady()) {
                if (this.getPlayerState() != rin.contracts.playerState.pausedForBuffering)
                    this._pauseForBuffering();

                this.setPlayerState(rin.contracts.playerState.pausedForBuffering);
            }
            else {
                this.setPlayerState(rin.contracts.playerState.playing);
                if (this.playerControl._interactionES !== null) {
                    this.playerControl.narrativeModeStarted.publish({ offset: offset, screenplayId: screenPlayId }, true);
                    this.playerControl._interactionES = null;
                }
                if (typeof this._lastPlayCallback == "function") {
                    this._lastPlayCallback(true);
                    this._lastPlayCallback = null;
                }
            }
        }

        var isSeek = !isCurrentScreenPlayId || !isOffsetCurrentTime;
        if (isSeek) {
            this.playerControl.seeked.publish({ offset: offset, screenplayId: this.currentScreenPlayId }, true);
        }

        this.eventLogger.logEndEvent(eventToken);
    },

    // Pause the narrative at the given offset.
    pause: function (offset, screenPlayId, onComplete) {
        if (typeof this._lastPauseCallback == "function" && typeof onComplete == "function") // Cancel existing call back with 'false' flag if a new callback is requested.
            this._lastPauseCallback(false);
        if (typeof onComplete == "function")
            this._lastPauseCallback = onComplete;

        rin.internal.debug.assert(this._isNarrativeLoaded, "Narrative is not loaded");
        if (!this._isNarrativeLoaded) {
            this._throwInvalidOperation("Invalid operation: Pause should be called only after loading narrative.");
            return;
        }

        var playerState = this.getPlayerState();
        if (playerState == rin.contracts.playerState.inTransition) return;

        // Validate offset.
        var previousTimeOffset = this.getCurrentLogicalTimeOffset();
        var isValidOffset = typeof (offset) == "number" && offset >= 0;
        offset = isValidOffset ? offset : previousTimeOffset;
        if (offset >= this._narrativeInfo.totalDuration) offset = this._narrativeInfo.totalDuration;
        screenPlayId = screenPlayId || this.currentScreenPlayId;

        // Round off offset.
        var epsilon = .1;
        var isCurrentScreenPlayId = this.currentScreenPlayId == screenPlayId;
        var isOffsetCurrentTime = (Math.abs(previousTimeOffset - offset) < epsilon) && isCurrentScreenPlayId;

        if (playerState == rin.contracts.playerState.pausedForExplore && isOffsetCurrentTime && isCurrentScreenPlayId) return;

        var eventToken = this.eventLogger.logBeginEvent("pause");
        // Set the state to transition for now as some ESes might take time to seek or load.
        this.setPlayerState(rin.contracts.playerState.inTransition);

        try {
            // Switch screenplay if necessary.
            if (!isCurrentScreenPlayId && this.isValidScreenPlayId(screenPlayId)) {
                this.switchHyperTimeline(screenPlayId);
            }

            // Seek to the offset.
            if (!isOffsetCurrentTime) {
                this.esItemsManager.esTimer.taskTimer.seek(offset);
                this.esItemsManager.updateCurrentESs(offset, previousTimeOffset);
                this.narrativeSeekedEvent.publish({ "seekTime": offset, "screenPlayId": screenPlayId });
            }

            // Pause all ESes.
            this._pauseCurrentESs(offset, screenPlayId);
        }
        finally {
            // Set player state to pause.
            this.goalPlayerState = rin.contracts.playerState.pausedForExplore;

            if (!this.esItemsManager.areAllESsReady()) {
                this.setPlayerState(rin.contracts.playerState.pausedForBuffering);
            }
            else {
                this.setPlayerState(rin.contracts.playerState.pausedForExplore);
                if (typeof this._lastPauseCallback == "function") {
                    this._lastPauseCallback(true);
                    this._lastPauseCallback = null
                }
            }
        }

        var isSeek = !isCurrentScreenPlayId || !isOffsetCurrentTime;
        if (isSeek) {
            this.playerControl.seeked.publish({ offset: offset, screenplayId: this.currentScreenPlayId }, true);
        }

        this.eventLogger.logEndEvent(eventToken);
    },

    // Helper method to check if a given screenplayId is valid or not.
    isValidScreenPlayId: function (screenPlayId) {
        return !!this._rinData.screenplays[screenPlayId];
    },

    // Helper method to check if a given screenplayId is the default or not.
    isDefaultScreenPlayId: function (screenPlayId) {
        return (screenPlayId == this._rinData.defaultScreenplayId);
    },

    // Method to switch a screenplay.
    switchHyperTimeline: function (screenPlayId) {
        rin.internal.debug.assert(this.isValidScreenPlayId(screenPlayId));

        this.esItemsManager.switchHyperTimeline(screenPlayId);
        this.currentScreenPlayId = screenPlayId;
    },

    // Gets if the player is muted.
    getIsMuted: function () {
        return this.playerConfiguration.isMuted;
    },

    // Set the muted state of the player.
    setIsMuted: function (value) {
        this.playerConfiguration.isMuted = value; //ToDo use a runtime configuration object rather than initial one.
        var esItems = this.esItemsManager.getCurrentESItems();
        // Apply to all ESes.
        for (var i = 0; i < esItems.length; i++) {
            var item = esItems[i];
            if (typeof item.experienceStream.setIsMuted === 'function') {
                item.experienceStream.setIsMuted(value);
            }
        }
    },

    updatePlayerConfiguration: function(settings){
        rin.util.overrideProperties(settings, this.playerConfiguration);
        this.onESEvent(this, rin.contracts.esEventIds.playerConfigurationChanged, settings);
    },

    // Get the player volume level.
    getPlayerVolumeLevel: function () {
        return this._playerVolumeLevel;
    },

    // Set the player volume level.
    setPlayerVolumeLevel: function (value) {
        this._playerVolumeLevel = value;
        var esItems = this.esItemsManager.getCurrentESItems();
        // Update volume of all ESes.
        for (var i = 0; i < esItems.length; i++) {
            var item = esItems[i];
            if (typeof item.experienceStream.setVolume === 'function') {
                // Set premultipled volume. Player volume chosen by the end user * ES base volume mentioned in the screenplay.
                item.experienceStream.setVolume(value * item.volumeLevel);
            }
        }
    },

    // Generic event which can be raised by any ES or other components. Pass it to all ESes.
    onESEvent: function (sender, eventId, eventData) {
        if (!this.esItemsManager) return;
        var esItems = this.esItemsManager.getCurrentESItems();
        for (var i = 0; i < esItems.length; i++) {
            var item = esItems[i];
            if (item.experienceStream.onESEvent) {
                item.experienceStream.onESEvent(sender, eventId, eventData);
            }
        }

        this.playerESEvent.publish(new rin.contracts.PlayerESEventArgs(sender, eventId, eventData));
    },

    // Sets interactive mode for sender or current ES
    startInteractionMode: function (interactionES) {

        // TODO: NarenD to verify if this is the right fix.
        // We disable interaction if it's a transition screenplay!
        var currentScreenplay = this.getScreenPlayPropertyTable(this.currentScreenPlayId);
        if (currentScreenplay && currentScreenplay.isTransitionScreenPlay && !currentScreenplay.allowInteraction)
            return;

        this.pause();
        var senderES = interactionES || this.getCurrentESItems().firstOrDefault(function (item) { return typeof item.experienceStream.getInteractionControls == "function"; })
        if (!senderES || this.playerControl._interactionES === senderES) return; // No ES to interact at this time, or no interaction ES change

        this.playerControl._interactionES = senderES;
        this.playerControl.interactionModeStarted.publish({ interactionES: senderES }, true);
    },

    playerESEvent: new rin.contracts.Event(),

    // Get the current logical time at which the narrative is at.
    getCurrentLogicalTimeOffset: function () {
        return (this.esItemsManager && this.esItemsManager.esTimer.taskTimer) ? this.esItemsManager.esTimer.taskTimer.getCurrentTimeOffset() : 0;
    },

    // Get the current player state.
    getPlayerState: function () {
        return this._playerState;
    },

    // Set the player state.
    setPlayerState: function (value) {
        if (value == this._playerState) return;
        var previousState = this._playerState;
        this._playerState = value;
        this.playerStateChangedEvent.publish(new rin.contracts.PlayerStateChangedEventArgs(previousState, value));
    },

    playerStateChangedEvent: new rin.contracts.Event(),

    // Gets if the player is ready or not.
    getIsPlayerReady: function () {
        return this._isPlayerReady;
    },

    // Set the ready state of the plaeyr.
    setIsPlayerReady: function (value) {
        if (this._isPlayerReady == value) return;
        this._isPlayerReady = value;
        this.isPlayerReadyChangedEvent.publish(value);
    },

    // Gets if the narrative is loaded.
    getIsNarrativeLoaded: function () {
        return this._isNarrativeLoaded;
    },

    isPlayerReadyChangedEvent: new rin.contracts.Event(),

    playerConfiguration: null,

    // Get the logical time relative an experience stream.
    getRelativeLogicalTime: function (experienceStream, experienceStreamId, absoluteLogicalTime) {
        absoluteLogicalTime = absoluteLogicalTime || this.getCurrentLogicalTimeOffset();

        // System ESes is not present on the timeline. So return absolute logical time.
        if (experienceStream.isSystemES) return absoluteLogicalTime;

        if (experienceStream instanceof rin.internal.ESItem)
            return this.esItemsManager.screenPlayInterpreter.getRelativeLogicalTime(experienceStream, absoluteLogicalTime);

        var allESItems = this.esItemsManager.screenPlayInterpreter.getESItems();
        // First search current ES Items in case keyframe sequence is repeated used in same screenplay.
        var esItem = this.getCurrentESItems().firstOrDefault(function (item) { return item.experienceStream == experienceStream && item.currentExperienceStreamId == experienceStreamId; });
        if (!esItem) {
            esItem = allESItems.firstOrDefault(function (item) { return item.experienceStream == experienceStream && item.currentExperienceStreamId == experienceStreamId; });
        }

        if (!esItem) {
            //todo: This is for backward compat with old xrins. Remove after porting all old xrins.
            esItem = allESItems.firstOrDefault(function (item) { return item.experienceStream == experienceStream; });
        }

        var relativeTime = this.esItemsManager.screenPlayInterpreter.getRelativeLogicalTime(esItem, absoluteLogicalTime);
        return Math.max(relativeTime, 0);
    },
    
    // Create and returns a new instance of the specified ES.
    createExperienceStream: function (providerId, esData, orchestratorProxy) {
        var providerName, providerVersion, esInfo;
        if (this._rinData.providers[providerId]) {
            providerName = this._rinData.providers[providerId].name;
            providerVersion = this._rinData.providers[providerId].version;
        }
        else {
            providerName = providerId;
        }

        esInfo = this.esItemsManager.createESItem(providerName, providerVersion, esData, orchestratorProxy);
        rin.internal.debug.assert(esInfo, "missing ES Info");
        return esInfo ? esInfo.experienceStream : null;
    },

    // Makes sure the given experience stream is loaded, If not load it.
    ensureExperienceStreamIsLoaded: function (experienceStreamInfo) {
        if (!this.isExperienceStreamLoaded(experienceStreamInfo.id)) {
            var experienceStreamId = experienceStreamInfo.currentExperienceStreamId;
            experienceStreamInfo.experienceStream.load(experienceStreamId);
            this._esLoadedInfo[experienceStreamInfo.id] = true;
        }
    },

    // Check if the given ES is loaded or not.
    isExperienceStreamLoaded: function (experienceStreamInfoId) {
        return !!this._esLoadedInfo[experienceStreamInfoId];
    },

    // Removed the loaded marker from the ES.
    removeLoadedState: function (experienceStreamInfoId) {
        delete this._esLoadedInfo[experienceStreamInfoId];
    },

    debugOnlyGetESItemInfo: function (experienceStream) {
        return this.esItemsManager.screenPlayInterpreter.getESItems().firstOrDefault(function (item) { return item.experienceStream == experienceStream });
    },

    // Method to load and get an instance of the interaction controls mentioned. The controls returned will be in the same order as the controlNames.
    getInteractionControls: function (controlNames, controlsLoadedCallback) {
        var controlNameCount = controlNames.length;
        var loadedControls = new rin.internal.List(); // Keep all loaded controls till all controls are loaded.
        loadedControls.length = controlNameCount; // Number of controls already loaded.

        // Called after each control is loaded.
        var interactionControlLoaded = function (interactionControl, index) {
            // Save the control to the correct index.
            loadedControls[index] = interactionControl;

            // check if all controls are loaded
            if (loadedControls.any(function (item) {
                return !item;
            }))
                return; // Wait for more controls to load.

            // as all controls are loaded, wrap it in a container and return it to the ES
            var interactionControlsWrap = document.createElement("div");
            loadedControls.foreach(function (item) {
                interactionControlsWrap.appendChild(item);
            });

            controlsLoadedCallback(interactionControlsWrap);
        };

        if (controlsLoadedCallback && controlNames instanceof Array) {
            for (var i = 0; i < controlNameCount; i++) {
                var self = this;
                (function () { // create a self executing function to capture the current index.
                    var currentIndex = i;
                    // Get the factory for the control requested.
                    var factoryFunction = rin.ext.getFactory(rin.contracts.systemFactoryTypes.interactionControlFactory, controlNames[i]);
                    // Create an instance of the control.
                    factoryFunction(self._resourcesResolver, function (interactionControl) {
                        interactionControlLoaded(interactionControl, currentIndex);
                    });
                })();
            }
        }
    },

    getAllSupportedControls: function (experienceStream) {
        //todo2
    },

    narrativeLoadedEvent: null,
    narrativeSeekedEvent: null,
    eventLogger: rin.internal.EventLogger,

    // Gets of the specified ES is on stage as of now.
    getIsOnStage: function (experienceStream) {
        var currentItems = this.getCurrentESItems();
        return currentItems && currentItems.firstOrDefault(function (item) { return item.experienceStream == experienceStream });
    },

    // Loads and initializes the orchestrator.
    load: function (rinData, onCompleted) {
        rin.internal.debug.assert(rinData, "Missing rin data");
        this._rinData = rinData;
        this._resourcesResolver.rinModel = rinData;
        this.currentScreenPlayId = rinData.defaultScreenplayId;
        var eventToken = this.eventLogger.logBeginEvent("Load");

        this.unload();

        this.setPlayerState(rin.contracts.playerState.pausedForBuffering);
        this._initializeNarrativeInfo(rinData);

        this.esItemsManager = new rin.internal.ESItemsManager();
        this.esItemsManager.initialize(rinData, this);

        var self = this;
        this.loadScreenPlayPropertyTable(function () {
            self._isNarrativeLoaded = true;
            self.narrativeLoadedEvent.publish();
            self.eventLogger.logEndEvent(eventToken);
            if (typeof onCompleted == "function") onCompleted();
        });

    },

    unload: function () {
        // Clean up the stage in case.
        rin.util.removeAllChildren(this.playerControl.stageControl);
        if (this.esItemsManager) this.esItemsManager.unload();
        this._esLoadedInfo = {};
        this._rinData = null;
    },

    // Get all ES items currently on stage.
    getCurrentESItems: function () {
        return (this.esItemsManager) ? this.esItemsManager.getCurrentESItems() : new rin.internal.List();
    },

    _captureKeyframeInternal: function (es) {
        var keyframe = es.experienceStream.captureKeyframe();
        if (keyframe) {
            keyframe["authoringMetadata"] = {
                provider: this._rinData.providers[es.providerId].name,
                experienceId: es.experienceId,
                experienceStreamId: es.currentExperienceStreamId
            }
        }
        return keyframe;
    },

    // Capture keyframe information from the active ES.
    captureKeyframe: function (experienceId, experienceStreamId) {
        var firstES = this.getCurrentESItems().firstOrDefault(function (item) {
            return typeof item.experienceStream.captureKeyframe == "function" &&
                    (!experienceId || experienceId === item.experienceId) &&
                    (!experienceStreamId || experienceStreamId === item.currentExperienceStreamId);
        });
        if (firstES) {
            return this._captureKeyframeInternal(firstES) || "";
        }
        return "";
    },
    // Capture keyframe information from the active ES.
    captureAllKeyframes: function () {
        var ess = this.getCurrentESItems().where(function (item) { return typeof item.experienceStream.captureKeyframe == "function"; });
        var self = this;
        return ess.select(function (es) {
            return self._captureKeyframeInternal(es);
        }).where(function (keyframe) { return !!keyframe });
    },

    debugApplyKeyframe: function (keyframe) {
        var firstES = this.getCurrentESItems().firstOrDefault(function (item) { return typeof item.experienceStream.displayKeyframe == "function"; });
        if (firstES && keyframe) {
            firstES.experienceStream.displayKeyframe(keyframe);
        }
    },

    loadScreenPlayPropertyTable: function (onComplete) {
        var self = this;
        var screenplayPropertiesResource = "ScreenplayProperties";
        if (!this._rinData.resources[screenplayPropertiesResource]) {
            if (typeof onComplete == "function") onComplete();
            return;
        }
        var screenplayUrl = self.getResourceResolver().resolveResource(screenplayPropertiesResource);
        // Download the narrative.
        var options = {
            url: screenplayUrl,
            dataType: "json",
            error: function (jqxhr, textStatus, errorThrown) {
                rin.internal.debug.write(errorThrown.message || errorThrown);
                if (typeof onComplete == "function")
                    onComplete();
            },
            success: function (data, textStatus, jqxhr) {
                self._screenplayPropertyTable = data[0];
                if (typeof onComplete == "function")
                    onComplete();
            }
        };
        $.ajax(options);
    },

    getScreenPlayPropertyTable: function (screenplayId) {
        return this._screenplayPropertyTable && this._screenplayPropertyTable[screenplayId];
    },


    // Seek the narrative using a well defined url. This is used to share a link to a particular time or experience in the narrative.
    seekUrl: function (seekUrl, onComplete) {
        var deepStateUrl = this.playerControl.resolveDeepstateUrlFromAbsoluteUrl(seekUrl);
        if (deepStateUrl) {
            var self = this;
            setTimeout(function () {
                self.playerConfiguration.narrativeRootUrl = null;
                self.playerControl.load(deepStateUrl, function (isInDeepState) { if (!isInDeepState) self.playerControl.play(); });
            }, 0);
            return;
        }
        var queryParams = rin.util.getQueryStringParams(seekUrl);

        // Load parameters from query string.
        var queryScreenPlayId = queryParams["screenPlayId"];
        var screenPlayId = this.isValidScreenPlayId(queryScreenPlayId) ? queryScreenPlayId : this._rinData.defaultScreenplayId;

        var seekTime = parseFloat(queryParams["begin"]) || parseFloat(queryParams["seekTime"]) || 0;
        var action = queryParams["action"] || (this.playerConfiguration.startInInteractionMode && "pause");

        if (action == "play" && queryParams["transition"] === "adaptive") {
            var resumeESItem = this.getCurrentESItems().firstOrDefault(function (es) { return es.experienceStream && typeof es.experienceStream.resumeFrom === "function"; });
            if (resumeESItem) {
                var newSeekUrl = rin.util.removeQueryStringParam(seekUrl, "transition");
                var relativeOffset = this._getESItemRelativeOffset(resumeESItem, seekTime);
                var newScreenPlayESItem = this.esItemsManager._getScreenPlayInterpreter(screenPlayId).getESItems().firstOrDefault(function (esItem) { return esItem.id === resumeESItem.id; });
                this.pause();
                resumeESItem.experienceStream.resumeFrom(relativeOffset, (newScreenPlayESItem || resumeESItem).currentExperienceStreamId, newSeekUrl);
                return;
            }
        }

        if (action == "pause" || (!action && this.getPlayerState() == rin.contracts.playerState.pausedForExplore)) {
            var self = this;
            this.pause(seekTime, screenPlayId, function (success) {
                if (!success) return;
                if (queryParams["state"]) {
                    var collectionReferences = JSON.parse(decodeURIComponent(queryParams["state"]));
                    var esStates = collectionReferences.experiences.itemReferences;
                    var esIds = [];
                    for (var id in esStates) {
                        esIds.push(id);
                    }

                    // process es states if present
                    if (esIds.length > 0) {
                        // As of now we are handling only one ES.
                        var es = self.getCurrentESItems().firstOrDefault(function (item) { return item.id == esIds[0]; });
                        if (es) {

                            if (typeof es.experienceStream.displayKeyframe == "function") {
                                setTimeout(function () {
                                    es.experienceStream.displayKeyframe(esStates[es.id]);
                                    if (typeof onComplete == "function") onComplete();
                                }, 500); // As some ESes might not have compleatly loaded.
                            }
                        }
                    }
                }
            });

        }
        else {
            this.play(seekTime, screenPlayId);
            if (typeof onComplete == "function") onComplete();
        }
        this.narrativeSeekedEvent.publish({ "seekTime": seekTime, "screenPlayId": queryScreenPlayId });
    },

    // Get seek url for the current state of the narrative.
    getDeepState: function () {
        //return "http://default/?screenPlayId={0}&seekTime={1}&action=play".rinFormat(this.currentScreenPlayId, this.getCurrentLogicalTimeOffset());
        var action = (this._playerState == rin.contracts.playerState.pausedForExplore || this._playerState == this._playerState == rin.contracts.stopped) ? "pause" : "play";
        var deepState =
            {
                "state": {
                    "document": {
                        "screenplayId": this.currentScreenPlayId
                    },
                    "animation": {
                        "begin": this.getCurrentLogicalTimeOffset().toFixed(2),
                        "action": action
                    },
                    "collectionReferences": {
                        "experiences": {
                            "itemReferences": {

                            }
                        }
                    }
                }
            };

        if (action = "pause") {
            // We are considering only one ES for now. Take first ES with isExplorable = true, or if none available, take first in the list.
            var currentESItems = this.getCurrentESItems();
            var firstES = currentESItems.firstOrDefault(function (esItem) { return esItem.experienceStream.isExplorable }) || currentESItems[0];
            if (firstES && typeof firstES.experienceStream.captureKeyframe == "function") {
                deepState.state.collectionReferences.experiences.itemReferences[firstES.id] = firstES.experienceStream.captureKeyframe() || {};
            }
        }

        return deepState;
    },

    stageAreaManager: null,
    esItemsManager: null,
    playerControl: null,
    goalPlayerState: null,
    currentScreenPlayId: null,

    _initializeNarrativeInfo: function (rinData, onCompleted) {
        this._rinData = rinData;
        this._narrativeInfo = new rin.internal.NarrativeInfo(this._rinData.data.narrativeData);

        //todo: resolve resource table
    },

    _pauseForBuffering: function () {
        var playerState = this.getPlayerState();
        rin.internal.debug.assert(this._isNarrativeLoaded);
        if (!this._isNarrativeLoaded || playerState == rin.contracts.playerState.inTransition || playerState == rin.contracts.playerState.pausedForBuffering) return;

        var eventToken = this.eventLogger.logBeginEvent("PauseNarrativeForBuffering");
        this.setPlayerState(rin.contracts.playerState.inTransition);
        try {
            this._pauseCurrentESs(this.getCurrentLogicalTimeOffset(), this.currentScreenPlayId || this._rinData.defaultScreenplayId);
        }
        finally {
            this.setPlayerState(rin.contracts.playerState.pausedForBuffering);
            this.goalPlayerState = rin.contracts.playerState.playing;
        }
        this.eventLogger.logEndEvent(eventToken);
    },

    _getESItemRelativeOffset: function (esItem, offset) {
        offset = typeof offset == "undefined" ? this.getCurrentLogicalTimeOffset() : offset;
        var relativeOffset = esItem.experienceStream.isSystemES ? offset : this.esItemsManager.screenPlayInterpreter.getRelativeLogicalTime(esItem, offset);
        return Math.max(relativeOffset, 0);
    },

    _playCurrentESs: function (offset, screenPlayId) {
        this.esItemsManager.getCurrentESItems().where(function(item) { return item.experienceStream.getState() == rin.contracts.experienceStreamState.ready; })
            .foreach(function (item) {
            item.experienceStream.play(this._getESItemRelativeOffset(item, offset), item.currentExperienceStreamId);
        }.bind(this));
    },

    _pauseCurrentESs: function (offset, screenPlayId) {
        this.esItemsManager.getCurrentESItems().where(function (item) { return item.experienceStream.getState() == rin.contracts.experienceStreamState.ready; })
            .foreach(function (item) {
            item.experienceStream.pause(this._getESItemRelativeOffset(item, offset), item.currentExperienceStreamId);
        }.bind(this));
    },

    _seekESItems: function (esItems, offset) {
        var isPlaying = this.getPlayerState() == rin.contracts.playerState.playing;
        esItems.where(function (item) { return item.experienceStream.getState() == rin.contracts.experienceStreamState.ready; })
            .foreach(function (item) {
            var relativeOffset = this._getESItemRelativeOffset(item);

            var experienceStreamId = item.currentExperienceStreamId;
            if (isPlaying) {
                item.experienceStream.play(relativeOffset, experienceStreamId);
            }
            else {
                item.experienceStream.pause(relativeOffset, experienceStreamId);
            }
        }, this);
    },


    // Executed just before a screenplay comes to an end.
    _onBeforeScreenPlayEnd: function () {
        var propertyTable = this.getScreenPlayPropertyTable(this.esItemsManager.screenPlayInterpreter.id);

        var endAction = propertyTable ? propertyTable["endActionUrl"] : null;
        var endActionProperty = endAction ? endAction["endActionUrlProperty"] : null;
        if (endActionProperty && endActionProperty["beforeEndAction"] == "pause") {
            this.startInteractionMode();
            this.playerControl.screenplayEnded.publish({ screenplayId: this.currentScreenPlayId }, true); // TODO: Post everest, we should not raise this even before actually screenplay ended.
        }
    },

    // Executed while screenplay has just come to an end.
    _onScreenPlayEnding: function () {
        var propertyTable = this.getScreenPlayPropertyTable(this.esItemsManager.screenPlayInterpreter.id);

        var endAction = propertyTable ? propertyTable["endActionUrl"] : null;
        var endActionProperty = endAction ? endAction["endActionUrlProperty"] : null;
        var url = endActionProperty ? endActionProperty["endActionUrl"] : null;

        if (url) {
            this.seekUrl(url);
            return true;
        }
        return false;
    },

    // Executed when the screenplay has ended.
    _onScreenPlayEnded: function () {
        var configuration = this.playerConfiguration;
        if (configuration.loop) {
            this.play(0, this.currentScreenPlayId);
        }
        else if (configuration.playerMode !== rin.contracts.playerMode.AuthorerEditor && configuration.playerMode !== rin.contracts.playerMode.AuthorerPreview) {
            this.pause();
            this.playerControl.screenplayEnded.publish({ screenplayId: this.currentScreenPlayId }, true);
        }
        else {
            this.pause();
            //--For authoring end, fire a player stopped event when the current screenplay ends.
            this.setPlayerState(rin.contracts.playerState.stopped);
        }
    },

    _throwInvalidOperation: function (errorDetails) {
        rin.internal.debug.assert(false, errorDetails);
        if (!this.playerConfiguration.degradeGracefullyOnErrors) throw new Error(errorDetails);
    },

    _rinData: null,
    _serviceItemsManager: null,
    _interactionControlsManager: null,
    _isNarrativeLoaded: null,
    _narrativeInfo: null,
    _resourcesResolver: null,
    _playerState: rin.contracts.playerState.stopped,
    _isPlayerReady: false,
    _stageAreaManager: null,
    _playerVolumeLevel: 1,
    _loadStartTime: 0,
    _esLoadedInfo: {},
    _lastPlayCallback: null,
    _lastPauseCallback: null,
    _screenplayPropertyTable: null
};

// Metadata about a narrative.
rin.internal.NarrativeInfo = function (narrativeData) {
    this.narrativeData = narrativeData;
    this.totalDuration = parseFloat(narrativeData.estimatedDuration);
    this.title = narrativeData.title;
    this.description = narrativeData.description;
    this.branding = narrativeData.branding;
    this.aspectRatio = narrativeData.aspectRatio || "None";
};

rin.internal.NarrativeInfo.prototype = {
    narrativeData: null,
    description: null,
    branding: null,
    title: null,
    totalDuration: null,
    beginOffset: null,
    aspectRatio: "None"
};
/// <reference path="Common.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="ESItem.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="ScreenPlayInterpreter.js"/>
/// <reference path="Orchestrator.js"/>
/// <reference path="ESItemsManager.js"/>
/// <reference path="EventLogger.js"/>

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.OrchestratorProxy = function (orchestrator) {
    this._orchestrator = orchestrator;

    this.playerStateChangedEvent = orchestrator.playerStateChangedEvent;
    this.eventLogger = orchestrator.eventLogger;
};

rin.internal.OrchestratorProxy.prototype = {
    _experienceStream: null,
    _orchestrator: null,

    init: function (experienceStream) {
        this._experienceStream = experienceStream;
    },

    getResourceResolver: function () {
        return this._orchestrator.getResourceResolver();
    },

    getCurrentLogicalTimeOffset: function () {
        return this._orchestrator.getCurrentLogicalTimeOffset();
    },

    getRelativeLogicalTime: function (experienceStreamId, absoluteLogicalTime) {
        return this._orchestrator.getRelativeLogicalTime(this._experienceStream, experienceStreamId, absoluteLogicalTime);
    },

    play: function (offset, screenPlayId) {
        this._orchestrator.play(offset, screenPlayId);
    },

    pause: function (offset, screenPlayId) {
        this._orchestrator.pause(offset, screenPlayId);
    },

    getIsMuted: function () {
        return this._orchestrator.getIsMuted();
    },

    setIsMuted: function (value) {
        this._orchestrator.setIsMuted(value);
    },

    getPlayerVolumeLevel: function () {
        return this._orchestrator.getPlayerVolumeLevel();
    },

    setPlayerVolumeLevel: function (value) {
        this._orchestrator.setPlayerVolumeLevel(value);
    },

    onESEvent: function (eventId, eventData) {
        this._orchestrator.onESEvent(this._experienceStream, eventId, eventData);
    },

    startInteractionMode: function () {
        var isOnStage = this._orchestrator.getIsOnStage(this._experienceStream);
        this._orchestrator.startInteractionMode(isOnStage ? this._experienceStream: null);
    },

    getInteractionControls: function (controlNames, callback) {
        var isOnStage = this._orchestrator.getIsOnStage(this._experienceStream);
        return isOnStage ? this._orchestrator.getInteractionControls(controlNames, callback): null;
    },

    getAllSupportedControls: function () {
        return this._orchestrator.getAllSupportedControls(this._experienceStream);
    },

    getPlayerState: function () {
        return this._orchestrator.getPlayerState();
    },

    getIsOnStage: function () {
        return this._orchestrator.getIsOnStage(this._experienceStream);
    },

    getScreenplayPropertyTable: function () {
        return this._orchestrator.getScreenplayPropertyTable(this._experienceStream);
    },

    getCurrentStateSeekUrl: function () {
        return this._orchestrator.getCurrentStateSeekUrl();
    },

    seekUrl: function (seekUrl) {
        return this._orchestrator.seekUrl(seekUrl);
    },

    debugOnlyGetESItemInfo: function () {
        return this._orchestrator.debugOnlyGetESItemInfo(this._experienceStream);
    },

    getCurrentESItems: function(){
        return this._orchestrator.getCurrentESItems();
    },

    createExperienceStream: function (providerId, esData, orchestratorProxy) {
        return this._orchestrator.createExperienceStream(providerId, esData, orchestratorProxy);
    },

    getStageControl: function () {
        return this._orchestrator.playerControl.stageControl;
    },
    getPlayerRootControl: function () {
        return this._orchestrator.playerControl.playerRootElement;
    },
    getPlayerConfiguration: function () {
        return this._orchestrator.playerConfiguration;
    },
    getNarrativeInfo: function () {
        return this._orchestrator.getNarrativeInfo();
    },
    getSegmentInfo: function () {
        return this._orchestrator.getSegmentInfo();
    },
    getPlayerControl: function () {
        return this._orchestrator.playerControl; //ToDo - verify and remove this method after everest
    },
    getESItems: function () {
        return this._orchestrator.esItemsManager._getScreenPlayInterpreter(this._orchestrator.currentScreenPlayId).getESItems();
    }
};

/// <reference path="PlayerConfiguration.js"/>
/// <reference path="../core/PlayerControl.js"/>
/// <reference path="../player/DefaultController.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};

/// <summary>Constructs a new Player object.</summary>
/// <param name="playerElement" type="element">HTML element that will host the player.</param>
/// <param name="options" type="rin.PlayerConfiguration or string">(optional) The player configuration. in query string form or rin.PlayerConfiguration object.</param>
/// <returns type="rin.Player">Returns a new Player object.</returns>
rin.createPlayerControl = function (playerElement, options, systemRootUrl) {
    var playerConfiguration = options && options.constructor == rin.PlayerConfiguration ? options : new rin.PlayerConfiguration(options);
    if (systemRootUrl) {
        playerConfiguration.systemRootUrl = systemRootUrl;
    }
    var playerControl;

    if (playerConfiguration.hideAllControllers || playerConfiguration.hideDefaultController || !playerConfiguration.playerControllerES) {
        playerControl = new rin.internal.PlayerControl(playerElement, playerConfiguration);
    }
    else {
        playerConfiguration.playerControllerES.initialize(playerElement, playerConfiguration);
        playerControl = playerConfiguration.playerControllerES.playerControl;
    }

    if (rin.internal.RinDebugger) {
        rin.debug = new rin.internal.RinDebugger(playerControl);
    }

    return playerControl;
};

// Get the player control associated with a DOM element.
rin.getPlayerControl = function (playerElement) {
    return playerElement && playerElement.rinPlayer;
};

// Bind a player control with a DOM element.
rin.bindPlayerControls = function (rootElement, systemRootUrl) {
    var playerElements = (rootElement || document).getElementsByClassName("rinPlayer");
    for (var i = 0, len = playerElements.length; i < len; i++) {
        var playerElement = playerElements[i];
        if (playerElement.rinPlayer instanceof rin.internal.PlayerControl) continue;
        playerElement.rinPlayer = rin.createPlayerControl(playerElement, playerElement.getAttribute("data-options"), systemRootUrl);

        var src = playerElement.getAttribute("data-src");
        if (src) {
            playerElement.rinPlayer.load(src);
        }
    }
};

// Start processing/loading the rin player.
rin.processAll = function (element, systemRootUrl) {
    var defLoader = new rin.internal.DeferredLoader();
    var promise = defLoader.loadSystemResources(systemRootUrl).then(function () {
        rin.bindPlayerControls(element, systemRootUrl);
    });
    return promise;
};
/// <reference path="../core/Common.js"/>
/// <reference path="../core/TaskTimer.js"/>
/// <reference path="../core/ESItem.js"/>
/// <reference path="../core/ESTimer.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/ScreenPlayInterpreter.js"/>
/// <reference path="../core/Orchestrator.js"/>
/// <reference path="../core/ESItemsManager.js"/>
/// <reference path="../core/EventLogger.js"/>
/// <reference path="../experiences/PlayerControllerES.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};

// Rin player configuration to be used for the startup of the player. These may be changed on the course of the narrative.
rin.PlayerConfiguration = function (options) {
    // Read any config data from query string.
    //ToDo revist the properties and various conditions

    var queryStrings = rin.util.getQueryStringParams();
    if (typeof (options) == "string") {
        var baseOptions = rin.util.getQueryStringParams(options);
        queryStrings = rin.util.overrideProperties(queryStrings, baseOptions);
    }
    else if (options && typeof (options) == "object") {
        queryStrings = rin.util.overrideProperties(queryStrings, options);
    } else if (!!options) {
        throw new Error("options should be a valid JSON formatted object or string formatted in 'query string' format");
    }

    // Checks HTML5 standard video tags like loop, autoplay, muted etc along with RIN player specific query strings.
    this.loop = !!queryStrings["loop"] && queryStrings["loop"] != "false";
    this.isFromRinPreviewer = !!queryStrings["isFromRinPreviewer"] && queryStrings["isFromRinPreviewer"] != "false";
    this.isGreedyBufferingDisabled = !!queryStrings["isGreedyBufferingDisabled"];
    var playerStartupAction = rin.contracts.playerStartupAction[queryStrings["playerStartupAction"]];
    var isAutoPlay = !!queryStrings["autoplay"] && queryStrings["autoplay"] != "false";
    this.playerStartupAction = playerStartupAction || (isAutoPlay ? rin.contracts.playerStartupAction.play : rin.contracts.playerStartupAction.none);

    this.isMuted = (queryStrings["muted"] === undefined ? (queryStrings["isMuted"] === undefined ? false : queryStrings["isMuted"]) : queryStrings["muted"]);
    this.isMusicMuted = (queryStrings["isMusicMuted"] === undefined ? false : queryStrings["isMusicMuted"]);

    this.hideAllControllers = queryStrings["controls"] == "false" || queryStrings["controls"] === false || (queryStrings["hideAllControllers"] && queryStrings["hideAllControllers"] != "false");
    this.hideDefaultController = !!queryStrings["hideDefaultController"] && queryStrings["hideDefaultController"] != "false";
    this.narrativeRootUrl = queryStrings["narrativeRootUrl"] || queryStrings["rootUrl"];
    this.systemRootUrl = queryStrings["systemRootUrl"];
    this.playerControllerES = new rin.internal.PlayerControllerES();
    this.playerMode = queryStrings["playerMode"];
    this.controllerOptions = queryStrings["controllerOptions"] || {};
};

rin.PlayerConfiguration.prototype = {
    mediaLoadTimeout: 30,
    playerMode: rin.contracts.playerMode.demo,
    playerStartupAction: rin.contracts.playerStartupAction.play,
    startSeekerPosition: 0,
    playerControllerES: null, //new rin.internal.PlayerControllerES(),

    hideAllControllers: false,
    hideDefaultController: false,
    hideTroubleshootingControls: false,
    degradeGracefullyOnErrors: false,
    playInDebugMode: true,
    defaultSegementId: null,
    defaultScreenplayId: null,
    narrativeRootUrl: null,
    systemRootUrl: null,
    loop: false,
    isGreedyBufferingDisabled: false,
    isMuted: false,
    controls: true,
    playerMode: rin.contracts.playerMode.Demo,
    isFromRinPreviewer: false,
    controllerOptions : null
};
/// <reference path="Common.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="ESItem.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="ScreenPlayInterpreter.js"/>
/// <reference path="EventLogger.js"/>

/// <reference path="../core/PlayerConfiguration.js"/>
/// <reference path="../core/PlayerControl.js"/>
/// <reference path="../core/ResourcesResolver.js"/>
/// <reference path="StageAreaManager.js" />
/// <reference path="Orchestrator.js" />
/// <reference path="../SystemESs/BufferingES.js" />
/// <reference path="RinDataProxy.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Player control contains a set of API's exposed for access by developers who integrate RIN to their products.
// Most of the calls are delegated to respective controllers. This class acts more or less like a proxy.
rin.internal.PlayerControl = function (stageControl, playerConfiguration, playerRoot) {
    this.stageControl = stageControl; // Control where all the rin content is displayed.
    this.playerConfiguration = playerConfiguration; // Player configuration for startup.
    this.orchestrator = new rin.internal.Orchestrator(this, playerConfiguration); // Orchestrator instance.
    this._eaController = new rin.embeddedArtifacts.embeddedArtifactsController(this.orchestrator);
    this._defaultBufferingES = new rin.internal.DefaultBufferingES(this.orchestrator); // Create a new buffering ES to show while loading the RIN.
    this.playerRootElement = playerRoot || stageControl; // The root DOM element of the player.
    this.volumeChangedEvent = new rin.contracts.Event();
    this.muteChangedEvent = new rin.contracts.Event();
};

rin.internal.PlayerControl.prototype = {
    playerConfiguration: null,
    orchestrator: null,
    stageControl: null,
    playerRootElement: null,
    narrativeUrl: null,
    // Load a narrative at the given URL and make a callback once loading is complete.
    load: function (narrativeUrl, onComplete) {
        var dataProxy = this._getDataProxy(this.playerConfiguration.playerMode);
        var self = this;

        var basicUrlLength = narrativeUrl.indexOf("?");
        if (basicUrlLength != -1)
        {
            self.narrativeUrl = narrativeUrl.substr(0, basicUrlLength);
        }
        else {
            self.narrativeUrl = narrativeUrl;
        }

        if (this._eaController) this._eaController.unload();

        dataProxy.getRinDataAsync(self.narrativeUrl,
            function (message) {
                self._showLoadingMessage(message);
            },
            function (rinData) {
                if (rinData && !rinData.error) {
                    if (!self.playerConfiguration.narrativeRootUrl) {
                        var lastSlashPos = self.narrativeUrl.lastIndexOf("/");
                        self.playerConfiguration.narrativeRootUrl = self.narrativeUrl.substr(0, lastSlashPos);
                    }

                    self.loadData(rinData, function () {
                        if (basicUrlLength != -1) {
                            self.orchestrator.seekUrl(narrativeUrl, function () {
                                if (typeof onComplete == "function")
                                    onComplete(true); // if in deepstate, pass true
                            });
                        } else {
                            if (typeof onComplete == "function")
                                onComplete();
                        }
                    });
                }
                else {
                    var error = "Error while loading narrative: " + (rinData ? rinData.error : "Narrative data not found.");
                    self.orchestrator.eventLogger.logErrorEvent(error);
                }
            });
    },

    // Load a narrative from the rinData provided and make a callback once loading is complete.
    loadData: function (rinData, onComplete) {
        var self = this;

        this.orchestrator.load(rinData, function (error) {
            if (!error) {
                if (self.playerConfiguration.playerStartupAction == rin.contracts.playerStartupAction.play) {
                    self.orchestrator.play();
                }
                //todo: handle pause action
                self._hideLoadingMessage();
                if (typeof onComplete === 'function') {
                    setTimeout(onComplete, 0);
                }
            }
            else {
                if (!self.playerConfiguration.degradeGracefullyOnErrors) throw new Error(error);
                self.orchestrator.eventLogger.logErrorEvent(error);
            }
        });
    },

    // Play the narrative at the given offset of the screenplay specified.
    play: function (offset, screenPlayId) {
        this.orchestrator.play(offset, screenPlayId);
    },

    // Pause the narrative at the given offset of the screenplay specified.
    pause: function (offset, screenPlayId) {
        this.orchestrator.pause(offset, screenPlayId);
    },

    // Unloads currently loaded narrative json and unloads each experience provider
    unload: function () {
        try{
            if (this._eaController)
                this._eaController.unload();
        }
        finally {
            
        }
        this.orchestrator.unload();
    },

    // Returns the players current state.
    getPlayerState: function () {
        return this.orchestrator.getPlayerState();
    },

    // Returns current screenplay id
    getCurrentScreenplayId: function(){
        return this.orchestrator.currentScreenPlayId;
    },

    // Returns the current logical offset of the player.
    getCurrentTimeOffset: function () {
        return this.orchestrator.getCurrentLogicalTimeOffset();
    },

    // Returns the control used to host ESes.
    getStageControl : function(){
        return this.stageControl;
    },

    // Returns the root DOM element of the player.
    getPlayerRoot: function () {
        return this.playerRootElement;
    },

    // Captures and returns a keyframe at the current logical offset for the esId passed or the first ES
    captureKeyframe: function (experienceId, experienceStreamId) {
        return this.orchestrator.captureKeyframe(experienceId, experienceStreamId);
    },

    // Captures and returns a keyframe at the current logical offset for all ESs
    captureAllKeyframes: function () {
        return this.orchestrator.captureAllKeyframes();
    },

    resolveDeepstateUrlFromAbsoluteUrl: function (absoluteUrl) {
        var params = rin.util.getQueryStringParams(absoluteUrl);
        if (params.hasOwnProperty("narrativeUrl") &&
            params.hasOwnProperty("begin") &&
            params.hasOwnProperty("action") &&
            params.hasOwnProperty("screenPlayId")) {

            var resolvedUrl = "{0}?begin={1}&action={2}&screenPlayId={3}".rinFormat(decodeURIComponent(params["narrativeUrl"]), params["begin"], params["action"], params["screenPlayId"]);
            if (params["state"]) resolvedUrl += "&state=" + params["state"];
            return resolvedUrl;
        }
        else {
            return false;
        }
    },

    // Get a URL which will load the narrative at the state it is currently.
    getDeepStateUrl: function(){
        var deepState = this.orchestrator.getDeepState();

        return rin.internal.getDeepState(deepState, this.narrativeUrl);
    },

    //Sets the player in loop and returns the current state
    //isPlayInLoop should be a number between 0 and 1
    loop: function (isPlayInLoop) {
        if (isPlayInLoop === true || isPlayInLoop === false) {
            this.playerConfiguration.loop = isPlayInLoop;
        } else if (this.playerConfiguration.loop === undefined) {
            this.playerConfiguration.loop = false; //default to false if undefined
        }
        return this.playerConfiguration.loop;
    },
    
    //Sets the player volume and returns the current volume
    //volumeLevel should be a number between 0 and 1
    volume: function (volumeLevel) {
        var currentLevel = this.orchestrator.getPlayerVolumeLevel();
        if (!isNaN(volumeLevel) && volumeLevel >= 0 && volumeLevel <= 1) {
            this.orchestrator.setPlayerVolumeLevel(volumeLevel);
            if (currentLevel !== volumeLevel) {
                this.volumeChangedEvent.publish(volumeLevel);
            }
        } else if (volumeLevel !== undefined) {
            throw new Error("IndexSizeError");
        }
        return currentLevel;
    },

    //Mutes the player and returns the current mute state
    //isMuted should be a bool value
    mute: function (isMuted) {
        var currentState = this.orchestrator.getIsMuted();
        if (isMuted === true || isMuted === false) {
            this.orchestrator.setIsMuted(isMuted);
            if (currentState !== isMuted) {
                this.muteChangedEvent.publish(isMuted);
            }
        }
        return currentState;
    },

    // Updates run time settings and notifies all current ES items to immediately react to settings.
    // Example settings object
    // { isMusicMuted: true, startInInteractionMode: true, isNarrativeMuted: true }
    // Object with only changed values can be set. For example, if only isMusicMuted is changed, call this with {isMusicMuted: true}
    updatePlayerConfiguration: function (settings) {
        this.orchestrator.updatePlayerConfiguration(settings);
    },
    
    // event triggered at end of current screenplay. params: screenPlayId
    screenplayEnded: new rin.contracts.Event(),

    // event triggered whenever timeline is seeked. params: offset, screenPlayId
    seeked: new rin.contracts.Event(),

    // Triggered when interaction mode starts. This also means interactive mode has ended. params: interactionES
    interactionModeStarted: new rin.contracts.Event(),

    // Triggered when interaction mode ends narrative is played
    narrativeModeStarted: new rin.contracts.Event(),

    getIsInInteractionMode: function () {
        return !!this._interactionES;
    },

    _showLoadingMessage: function (message) {
        if (!this._defaultBufferingES) this._defaultBufferingES = new rin.internal.DefaultBufferingES(this.orchestrator);

        var uiControl = this._defaultBufferingES.getUserInterfaceControl();
        if (rin.util.hasChildElement(this.stageControl.childNodes, uiControl)) return;

        this.stageControl.appendChild(uiControl);

        if (this.playerConfiguration.playInDebugMode) {
            rin.util.assignAsInnerHTMLUnsafe(uiControl, "<div>" + message + "</div>");
        }
        this._defaultBufferingES.showBuffering();
    },
    _hideLoadingMessage: function () {
        var uiControl = this._defaultBufferingES.getUserInterfaceControl();
        if (this._defaultBufferingES && rin.util.hasChildElement(this.stageControl.childNodes, uiControl)) {
            this._defaultBufferingES.hideBuffering();
            this.stageControl.removeChild(uiControl);
        }
    },

    _defaultBufferingES: null,
    _getDataProxy: function (playerMode) {
        //if (playerMode == rin.contracts.playerMode.demo) 
        rin.internal.debug.assert(playerMode == rin.contracts.playerMode.demo, "Player mode must be Demo for now");
        return new rin.internal.DemoRinDataProxy();
    },
    _showEventLog: function () { //todo
    },
    _getEventLog: function () { //todo
    },
    _interactionES: undefined,

    //ToDo - use the setting object rather than using seperate events
    volumeChangedEvent: undefined,
    muteChangedEvent: undefined
};
/// <reference path="../core/Common.js"/>
/// <reference path="../core/TaskTimer.js"/>
/// <reference path="../core/ESItem.js"/>
/// <reference path="../core/ESTimer.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/ScreenPlayInterpreter.js"/>
/// <reference path="../core/Orchestrator.js"/>
/// <reference path="../core/ESItemsManager.js"/>
/// <reference path="../core/EventLogger.js"/>

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// ResourceResolver handles resolving named resources to absolute URIs.
rin.internal.ResourcesResolver = function (playerConfiguration) {
    this._playerConfiguration = playerConfiguration;
};

rin.internal.ResourcesResolver.prototype = {
    rinModel: null,
    _playerConfiguration: null,
    _systemRootUrl: null,
    // Resolve a named resource to an absolute URI.
    resolveResource: function (resourceItemId, experienceId, bandwidth) { //todo: implement
        var resourceItem = this.rinModel.resources[resourceItemId];
        if (experienceId && this.rinModel.experiences[experienceId] && this.rinModel.experiences[experienceId].resources)
            resourceItem = this.rinModel.experiences[experienceId].resources[resourceItemId] || resourceItem;
        var url = resourceItem ? resourceItem.uriReference : resourceItemId;

        // See if the resource URL is relative.
        if (!rin.util.isAbsoluteUrl(url)) {
            var baseUrl = this._playerConfiguration.narrativeRootUrl || rin.util.getDocumentLocationRootUrl();
            url = rin.util.combinePathElements(baseUrl, url);
        }
        return url;
    },
    // Resolve a named resource to a data object.
    resolveData: function (resourceItemId, experienceId) { 
        var resourceItem = this.rinModel.resources[resourceItemId];
        if (experienceId && this.rinModel.experiences[experienceId] && this.rinModel.experiences[experienceId].resources)
            resourceItem = this.rinModel.experiences[experienceId].resources[resourceItemId] || resourceItem;
        if (resourceItem && resourceItem.data && typeof resourceItem.data === "object") { 
            return rin.util.deepCopy(resourceItem.data);
        };
        return null;
    },
    // Return the root URL of the player.
    getSystemRootUrl: function () {
        this._systemRootUrl = this._systemRootUrl ||
            rin.util.combinePathElements(
            /*Pick either the combination of current document url and systemRootUrl or pick only systemRootUrl if it is absolute url*/
                rin.util.isAbsoluteUrl(this._playerConfiguration.systemRootUrl) ?
                                        this._playerConfiguration.systemRootUrl :
                                        rin.util.combinePathElements(rin.util.getDocumentLocationRootUrl(), this._playerConfiguration.systemRootUrl),
                "systemResources/themeResources");
        return this._systemRootUrl;
    },
    // Resolve a resource from relative to absolute URI.
    resolveSystemResource: function (relativeResourceLocation) {
        // FUTURE$ Theme & language will be looked up to resolve to right URL.
        var absoluteUrl = rin.util.combinePathElements(this.getSystemRootUrl(), relativeResourceLocation);
        return absoluteUrl;
    }
};
/// <reference path="Common.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="ESItem.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="ScreenPlayInterpreter.js"/>
/// <reference path="EventLogger.js"/>
/// <reference path="../core/PlayerConfiguration.js"/>
/// <reference path="../core/PlayerControl.js"/>
/// <reference path="../core/ResourcesResolver.js"/>
/// <reference path="StageAreaManager.js" />
/// <reference path="Orchestrator.js" />
/// <reference path="../SystemESs/BufferingES.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.DemoRinDataProxy = function () {
};

rin.internal.DemoRinDataProxy.prototype = {
    getRinDataAsync: function (narrativeUrl, onSetStatusMessage, onComplete) {
        var self = this,
            rinData;
        if (onSetStatusMessage) {
            onSetStatusMessage("Loading Narrative...");
        }

        // Download the narrative.
        var options = {
            url: narrativeUrl,
            dataType: "json",
            error: function (jqxhr, textStatus, errorThrown) {
                if (typeof onComplete == "function") {
                    rinData = { error: errorThrown.message || errorThrown };
                    if (onComplete) {
                        onComplete(rinData);
                    }
                }
            },
            success: function (data, textStatus, jqxhr) {
                if (typeof onComplete == "function") {
                    rinData = data[0];
                    if (onComplete) {
                        onComplete(rinData);
                    }
                }
            }
        };
        $.ajax(options);
    },
}; 
/// <reference path="Common.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="ESItem.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="EventLogger.js"/>

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.DefaultScreenPlayInterpreter = function () {
    this._allESItems = new rin.internal.List();
};

rin.internal.DefaultScreenPlayInterpreter.prototype = {
    _allESItems: null,
    _orchestrator: null,
    _screenPlayData: null,

    initialize: function (screenPlayId, segmentData, orchestrator) {
        this._screenPlayData = segmentData.screenplays[screenPlayId].data;
        this.id = screenPlayId;
        this._orchestrator = orchestrator;

        var esItems = new rin.internal.List(),
            lastZIndex = 0,
            experienceStreamReferenceList = this._screenPlayData.experienceStreamReferences,
            experienceStreamReference, experienceId, esData, es, esLayer, experienceStreamId, esItem, control;
        for (var i = 0, len = experienceStreamReferenceList.length; i < len; i++) {
            experienceStreamReference = experienceStreamReferenceList[i];
            experienceId = experienceStreamReference.experienceId;
            experienceStreamId = experienceStreamReference.experienceStreamId;
            if (experienceStreamReference.layer) {
                esLayer = rin.contracts.experienceStreamLayer[experienceStreamReference.layer] || rin.contracts.experienceStreamLayer.background;
            }
            esData = segmentData.experiences[experienceId];
            if (!esData) { rin.internal.debug.write("Experience Data not available for " + experienceId); continue; }
            esData.id = experienceId;
            esData.experienceId = experienceId;
            es = orchestrator.createExperienceStream(esData.providerId, esData);
            if (!es) continue; //todo: need to implement delay loading
            esItem = new rin.internal.ESItem(esData.id, esData, es,
                                parseInt(experienceStreamReference.zIndex) || lastZIndex++,
                                experienceStreamReference.begin,
                                (parseFloat(experienceStreamReference.begin) + parseFloat(experienceStreamReference.duration)),
                                esLayer);
            esItem.experienceId = experienceId;
            esItem.currentExperienceStreamId = experienceStreamId;
            esItem.providerId = esData.providerId;
            esItem.volumeLevel = parseFloat(experienceStreamReference.volume) || 1;
            control = es.getUserInterfaceControl();
            if (control && control.setAttribute) control.setAttribute("ES_ID", esData.id);
            esItems.push(esItem);
        }
        this._allESItems = esItems;
    },

    getESItems: function (fromOffset, toOffset) {
        if (typeof fromOffset == "undefined") return this._allESItems;
        // change to milliseconds
        fromOffset = fromOffset;
        toOffset = toOffset || fromOffset + .1 /*epsilon*/ ;
        return this._allESItems.filter(function (es) { return es.beginOffset <= toOffset && es.endOffset > fromOffset; });

    },

    setScreenPlayAttributes: function (esInfo) {
        if (!esInfo.experienceStream || !esInfo.experienceStream.setVolume || !esInfo.experienceStream.setIsMuted || esInfo.volumeLevel === undefined) return;

        esInfo.experienceStream.setVolume(this._orchestrator.getPlayerVolumeLevel() * esInfo.volumeLevel);
        esInfo.experienceStream.setIsMuted(this._orchestrator.getIsMuted());
    },

    getRelativeLogicalTime: function (esItem, absoluteLogicalTimeOffset) {
        rin.internal.debug.assert(esItem instanceof rin.internal.ESItem);

        var relativeLogicalTimeOffset = esItem ? absoluteLogicalTimeOffset - esItem.beginOffset : absoluteLogicalTimeOffset;
        relativeLogicalTimeOffset = Math.max(relativeLogicalTimeOffset, 0);
        return relativeLogicalTimeOffset;
    },

    getEndTime: function () {
        if (this._allESItems.length == 0) return 0;

        var lastItem = this._allESItems.max(function (item) { return item.endOffset; });
        return lastItem ? lastItem.endOffset : 0;
    }
};
///<reference path="Common.js"/>
///<reference path="..\Core\Utils.js"/>
///<reference path="TaskTimer.js"/>
///<reference path="ESItem.js"/>
///<reference path="..\contracts\IExperienceStream.js"/>
///<reference path="ScreenPlayInterpreter.js"/>
///<reference path="EventLogger.js"/>
///<reference path="..\Core\PlayerConfiguration.js"/>
///<reference path="..\Core\PlayerControl.js"/>
///<reference path="..\Core\ResourcesResolver.js"/>
/// <reference path="TransitionService.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.StageAreaManager = function (orchestrator, stageControl) {
    this._orchestrator = orchestrator;
    this._stageControl = stageControl;
};

rin.internal.StageAreaManager.prototype = {

    onCurrentExperienceStreamsChanged: function (addedItems, removedItems, currentList, isSeek) {
        var self = this;
        var wereItemsAdded = addedItems && addedItems.length > 0;
        var wereItemsRemoved = removedItems && removedItems.length > 0;
        
        if (wereItemsRemoved) {
            for (var i = 0; i < removedItems.length; i++) {
                var item = removedItems[i];
                if (addedItems && addedItems.length > 0 && addedItems.any(function (i) { return i.experienceStream == item.experienceStream; })) continue;

                var uiElement = item.experienceStream.getUserInterfaceControl();
                if (!uiElement) continue;

                if (isSeek) {
                    // cancel any existing transition and hide element without transition
                    uiElement.style.zIndex = -1;
                    var transition = uiElement.transition;
                    if (transition) transition.cancelTransition();
                    rin.util.hideElementByOpacity(uiElement);
                }
                else { // show es with transition
                    //item.ExperienceStream.UserInterfaceControl.IsHitTestVisible = false;
                    (function (uiElement, item) {
                        var currentTransition = self._getTransition(item);
                        uiElement.transition = currentTransition;
                        currentTransition.transition.TransitionOut(uiElement, currentTransition.transitionOutDuration, function () {
                            uiElement.transition = null;
                                rin.util.hideElementByOpacity(uiElement);
                                uiElement.style.zIndex = -1;
                        });
                    })(uiElement, item);
                }
            }
        }

        if (wereItemsAdded) {
            for (var i = 0; i < addedItems.length; i++) {
                var item = addedItems[i];

                this._orchestrator.ensureExperienceStreamIsLoaded(item);
                var uiControl = item.experienceStream.getUserInterfaceControl();
                if (uiControl) {
                    if (removedItems && removedItems.length > 0 && removedItems.any(function (i) { return i.experienceStream == item.experienceStream; })) continue;

                    if (!rin.util.hasChildElement(this._stageControl.childNodes, uiControl))
                        this._stageControl.appendChild(uiControl);

                    self._setZIndex(item);

                    var currentUIControl = item.experienceStream.getUserInterfaceControl();

                    if (isSeek) {
                        // cancel any existing transition and hide element without transition
                        var transition = currentUIControl.transition;
                        if (transition) transition.cancelTransition(); // TODO: Cancel transitions in other cases also after Everest.
                        rin.util.unhideElementByOpacity(currentUIControl);
                    }
                    else {
                        (function (item, currentUIControl) {
                            var currentTransition = self._getTransition(item);
                            setTimeout(function () {

                                currentUIControl.transition = currentTransition;
                                if (currentUIControl) {
                                    currentTransition.transition.TransitionIn(currentUIControl, currentTransition.transitionInDuration, function () {
                                        currentUIControl.transition = null;
                                        rin.util.unhideElementByOpacity(currentUIControl);
                                        self._setZIndex(item);
                                    });
                                }
                            }, 15);
                        })(item, currentUIControl);
                    }
                }

            }
        }
    },

    _setZIndex: function (esInfo) {
        var esLayer = esInfo.experienceStreamLayer;
        var layerRangeStart = (esLayer == rin.contracts.experienceStreamLayer.background) ? 10000 :
            (esLayer == rin.contracts.experienceStreamLayer.foreground || esLayer == rin.contracts.experienceStreamLayer.projection) ? 20000 : 30000;

        var zIndex = layerRangeStart + esInfo.zIndex || 0;
        var uiElement = esInfo.experienceStream.getUserInterfaceControl();
        if (uiElement && uiElement.style) {
            uiElement.style.zIndex = zIndex;
            uiElement.style.position = "absolute";
            this._orchestrator.eventLogger.logEvent("ZIndex set for {0} to {1}", esInfo.id, zIndex);
        }
    },
    _getTransition: function (esInfo) {
        var transition = new rin.internal.TransitionEffect(),
            transitionData;
        if (esInfo && esInfo.esData) {
            if (esInfo.esData.data && esInfo.esData.data.transition) {
                transitionData = transitionData || {};
                rin.util.overrideProperties(esInfo.esData.data.transition, transitionData);
            }
            if (esInfo.currentExperienceStreamId) {
                var currentExperienceStream = esInfo.esData.experienceStreams[esInfo.currentExperienceStreamId];
                if (currentExperienceStream && currentExperienceStream.data && currentExperienceStream.data.transition) {
                    transitionData = transitionData || {};
                    rin.util.overrideProperties(currentExperienceStream.data.transition, transitionData);
                }
            }
        }        
        if(transitionData) {
            transition.transitionInDuration = transitionData.inDuration;
            transition.transitionOutDuration = transitionData.outDuration;
        }

        return transition;
    },
    _orchestrator: null,
    _stageControl: null
};

rin.internal.TransitionEffect = function (transition) {
    this.transition = transition || new rin.FadeInOutTransitionService();
};

rin.internal.TransitionEffect.prototype = {
    transition: null,
    transitionInDuration: .5,
    transitionOutDuration: .5,
    cancelTransition: function () { this.transition.cancelTransition(); }
};
/// <reference path="Common.js"/>
/// <reference path="../contracts/IExperienceStream.js" />

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Data structure to hold an item inside the TaskTimer.
rin.internal.TaskTimerItem = function (timeOffset, context) {
    this.offset = timeOffset;
    this.context = context
};

// TaskTimer manages a list of tasks each with its own time offsets and fires an event with the appropriate task on time.
rin.internal.TaskTimer = function (taskItems) {
    this._timerItems = new rin.internal.List(); // List to hold all tasks.
    this._stopWatch = new rin.internal.StopWatch(); // Stopwatch to maintain time.
    this.taskTriggeredEvent = new rin.contracts.Event(); // Event to be fired when a time times out.
    this.addRange(taskItems); // Add the list of tasks to the TaskTimer.
};

rin.internal.TaskTimer.prototype = {
    _timerTriggerPrecision: 0.02,
    _timerItems: null,
    _timerId: -1,
    _stopWatch: null,
    _nextItemIndex: 0,
    _itemsChanged: false,

    taskTriggeredEvent: new rin.contracts.Event(),

    // Returns the current time offset of the TaskTimer.
    getCurrentTimeOffset: function () { return this._stopWatch.getElapsedSeconds(); },

    // Add a task at the offset specified.
    add: function (offset, context) {
        if (this._timerId > 0)
        { throw new Error("Items cannot be added when timer is running. Stop the timer and then add items"); }

        this._timerItems.push(new rin.internal.TaskTimerItem(offset, context));
        this._itemsChanged = true;
    },

    // Add multiple tasks at once.
    addRange: function (taskItems) {
        if (!taskItems || taskItems.length == 0) return;
        if (this._timerId > 0)
        { throw new Error("Items cannot be added when timer is running. Stop the timer and then add items"); }

        this._timerItems = this._timerItems.concat(taskItems);
        this._itemsChanged = true;
    },

    // Remove an existing task from the list.
    remove: function (offset, context) { throw new Error("to be implemented"); },

    // Start playing the task timer.
    play: function () {
        this._checkChangedItems();
        this._triggerCurrentItems();
        this._scheduleNextItem();
        this._stopWatch.start();
    },

    // Pause the TaskTimer.
    pause: function () {
        clearTimeout(this._timerId);
        this._timerId = -1;
        this._stopWatch.stop();
    },

    // Seek the timer to a specified offset. Optionally specify if the timer should play from that point automatically.
    seek: function (offset, autoStartAfterSeek) {
        var change = Math.abs(offset - this.getCurrentTimeOffset());
        if (change > this._timerTriggerPrecision) {
            this.pause();
            this._stopWatch.reset();
            this._stopWatch.addElapsed(offset);
            this._checkChangedItems();
            this._nextItemIndex = this._findFirstTaskIndexAtTime(offset);
            this._triggerCurrentItems();
            this._scheduleNextItem();
        }

        if (autoStartAfterSeek) this._stopWatch.start();
    },

    // Get the task item at the current offset. If there is nothing at the current offset, get the previous item.
    getCurrentOrPrevious: function (offset) {
        var item = this._timerItems.lastOrDefault(function (x) {
            return x.offset <= offset;
        });
        return item ? item.context : null;
    },

    _timer_tick: function () {
        this._triggerCurrentItems();
        this._scheduleNextItem();
    },

    _triggerCurrentItems: function () {
        if (this._nextItemIndex < 0) return;

        var index = this._nextItemIndex;
        var endOffset = this.getCurrentTimeOffset() + this._timerTriggerPrecision;
        var currentItems = new rin.internal.List();

        while (index < this._timerItems.length && this._timerItems[index].offset <= endOffset) {
            currentItems.push(this._timerItems[index].context);
            index++;
        }

        if (currentItems.length > 0) {
            var self = this;
            setTimeout(function () {
                self.taskTriggeredEvent.publish(currentItems);
            }, 0);
        }

        this._nextItemIndex = (index < this._timerItems.length) ? index : -1;
    },

    _scheduleNextItem: function () {
        if (this._nextItemIndex < 0) return;

        var nextItem = this._timerItems[this._nextItemIndex];
        if (nextItem.offset == Infinity) return;

        var interval = Math.max((nextItem.offset - this.getCurrentTimeOffset()), 0);

        clearTimeout(this._timerId);
        var self = this;
        this._timerId = setTimeout(function () { self._timer_tick() }, interval * 1000);
    },


    _checkChangedItems: function () {
        if (this._itemsChanged) {
            this._timerItems.sort(function (a, b) { return a.offset - b.offset; });
            this._nextItemIndex = this._findFirstTaskIndexAtTime(this.getCurrentTimeOffset());
            this._itemsChanged = false;
        }
    },

    _findFirstTaskIndexAtTime: function (offset) {
        return this._timerItems.firstOrDefaultIndex(function (x) { return x.offset >= offset; });
    }

};
/// <reference path="Common.js"/>
/// <reference path="../core/Utils.js"/>
/// <reference path="TaskTimer.js"/>
/// <reference path="ESItem.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="ScreenPlayInterpreter.js"/>
/// <reference path="EventLogger.js"/>
/// <reference path="../core/PlayerConfiguration.js"/>
/// <reference path="../core/PlayerControl.js"/>
/// <reference path="../core/ResourcesResolver.js"/>

/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Transition to immediatly switch from one ES to other without any gradual changes.
rin.internal.CutSceneTransitionService = function () {
};

rin.internal.CutSceneTransitionService.prototype = {
    // Show an ES with the in transition.
    TransitionIn: function (element, transitionTime, onCompleted) {
        rin.util.unhideElementByOpacity(element); // Show the ES immediatly.
        if (typeof onCompleted == "function") onCompleted();
    },

    // Hide an ES with the out transition.
    TransitionOut: function (element, transitionTime, onCompleted) {
        rin.util.hideElementByOpacity(element);
        if (typeof onCompleted == "function") onCompleted();
    }
};

// Transition to gradually fade in the new ES and fade out the previous one.
rin.FadeInOutTransitionService = function () {
};

rin.FadeInOutTransitionService.prototype = {
    attachedElement: null,
    _storyboard : null,

    // Show an ES with the in transition.
    TransitionIn: function (element, transitionTime, onCompleted) {
        this.attachedElement = element;
        this._animate(element, transitionTime, 0, 1, onCompleted);
    },

    // Hide an ES with the out transition.
    TransitionOut: function (element, transitionTime, onCompleted) {
        this.attachedElement = element;
        this._animate(element, transitionTime, 1, 0, onCompleted);
    },

    // Cancel the active transition.
    cancelTransition: function () {
        this._storyboard.stop();
        rin.util.setElementOpacity(this.attachedElement, 1);
    },

    _animate: function (element, transitionTime, opacityFrom, opacityTo, onCompleted) {
        var onAnimate = function (value) { rin.util.setElementOpacity(element, value); }
        this._storyboard = new rin.internal.Storyboard(new rin.internal.DoubleAnimation(transitionTime, opacityFrom, opacityTo), onAnimate, onCompleted);
        this._storyboard.begin();
    }
};
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../core/Common.js"/>
/// <reference path="../core/TaskTimer.js"/>
/// <reference path="../core/ESItem.js"/>
/// <reference path="../core/ESTimer.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/ScreenPlayInterpreter.js"/>
/// <reference path="../core/Orchestrator.js"/>
/// <reference path="../core/ESItemsManager.js"/>
/// <reference path="../core/EventLogger.js"/>

window.rin = window.rin || {};

// ES for showing the buffering state.
rin.internal.DefaultBufferingES = function (orchestrator) {
    this.stateChangedEvent = new rin.contracts.Event();
    this._orchestrator = orchestrator;
    this._userInterfaceControl = rin.util.createElementWithHtml(rin.internal.DefaultBufferingES.elementHTML);
    var loaderimageUrl = orchestrator.getResourceResolver().resolveSystemResource("images/loader.gif");
    if (loaderimageUrl)
        $(".loaderGIFContainer", this._userInterfaceControl).attr("src", loaderimageUrl);

    this._orchestrator.isPlayerReadyChangedEvent.subscribe(function () { this._onOrchestratorIsPlayerReadyStateChanged() }.bind(this));
    rin.util.overrideProperties({ zIndex: 200000, width: "100%", height: "100%", display: "none" }, this._userInterfaceControl.style);
};

rin.internal.DefaultBufferingES.prototype = {
    isSystemES: true,
    load: function (experienceStreamId) {
        this._updateBufferingState();
    },
    play: function (offset, experienceStreamId) {
        this._updateBufferingState();
    },
    pause: function (offset, experienceStreamId) {
        this._updateBufferingState();
    },
    unload: function () {
        this._updateBufferingState();
    },
    getState: function () {
        return rin.contracts.experienceStreamState.ready;
    },
    stateChangedEvent: new rin.contracts.Event(),
    getUserInterfaceControl: function () {
        return this._userInterfaceControl;
    },
    // Show the buffering visual.
    showBuffering: function () {
        if (this._showBufferingTimerId) return;
        this._showBufferingTimerId = setTimeout(function () {
            var $userInterfaceControl = $(this._userInterfaceControl);
            $userInterfaceControl.stop(true);
            this._userInterfaceControl.style["display"] = "block";
            $userInterfaceControl.animate({ opacity: 0.5 }, "fast");
        }.bind(this), 700);
        if (this._orchestrator) this._orchestrator.eventLogger.logEvent("->-> BufferingES: ShowBuffering called.");
    },
    // Hide the buffering visual.
    hideBuffering: function () {
        clearTimeout(this._showBufferingTimerId);
        this._showBufferingTimerId = null;
        var $userInterfaceControl = $(this._userInterfaceControl);
        $userInterfaceControl.stop(true);
        $userInterfaceControl.animate({ opacity: 0.0 }, "fast", function () {
            this._userInterfaceControl.style["display"] = "none";
        }.bind(this));
        if (this._orchestrator) this._orchestrator.eventLogger.logEvent("->-> BufferingES: HideBuffering called.");
    },

    _userInterfaceControl: rin.util.createElementWithHtml(""),
    _onOrchestratorIsPlayerReadyStateChanged: function () {
        this._updateBufferingState();
    },
    _updateBufferingState: function () {
        var isPlayerReady = this._orchestrator.getIsPlayerReady();
        if (isPlayerReady) {
            this.hideBuffering();
        }
        else {
            this.showBuffering();
        }
    },
    _showBufferingTimerId: null,
    _orchestrator: null
};

rin.internal.DefaultBufferingES.elementHTML = "<div id='bufferingDiv' style='margin:auto;width:100%;height:100%;font-size:18px;color:white;display:table;'><div style='text-align:center;vertical-align: middle;display:table-cell;'><div style='width:auto;height:auto;clear:right;margin-left:auto;margin-right:auto;margin-bottom:8px;'><img class='loaderGIFContainer' /></div>Loading...</div></div>";
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../core/Common.js"/>
/// <reference path="../core/TaskTimer.js"/>
/// <reference path="../core/ESItem.js"/>
/// <reference path="../core/ESTimer.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/ScreenPlayInterpreter.js"/>
/// <reference path="../core/Orchestrator.js"/>
/// <reference path="../core/ESItemsManager.js"/>
/// <reference path="../core/EventLogger.js"/>

window.rin = window.rin || {};

rin.internal.ESTimerES = function (orchestrator, esManager) {
    this.stateChangedEvent = new rin.contracts.Event();
    this._orchestrator = orchestrator;
    this.esTimer = new rin.internal.ESTimer(orchestrator, esManager);
};

rin.internal.ESTimerES.prototype = {
    isSystemES: true,
    load: function (offset) {
        this.esTimer.loadESItmes();
        if (offset > 0) this.seek(0);
    },
    play: function (offset, experienceStreamId) {
        this._orchestrator.eventLogger.logEvent("!! Logical timer played at : {0}", this.esTimer.taskTimer.getCurrentTimeOffset() / 1000);
        this.esTimer.taskTimer.seek(offset);
        this.esTimer.taskTimer.play();
    },
    pause: function (offset, experienceStreamId) {
        this._orchestrator.eventLogger.logEvent("!! Logical timer paused at : {0}", this.esTimer.taskTimer.getCurrentTimeOffset() / 1000);
        this.esTimer.taskTimer.seek(offset);
        this.esTimer.taskTimer.pause();
    },
    unload: function () {
        this.esTimer.taskTimer.pause();
    },
    getState: function () {
        return rin.contracts.experienceStreamState.ready;
    },
    stateChangedEvent: new rin.contracts.Event(),
    getUserInterfaceControl: function () { return null; },
    esTimer: null,

    _orchestrator: null
};

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {
    // Dummy ES to replace with any ES which cannot be displayed or missing.
    var PlaceholderES = function (orchestrator, esData) {
        PlaceholderES.parentConstructor.apply(this, arguments);
        this._userInterfaceControl = rin.util.createElementWithHtml(PlaceholderES.elementHTML).firstChild;
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, PlaceholderES);

    PlaceholderES.prototypeOverrides = {
        // Load and display the ES.
        load: function (experienceStreamId) {
            PlaceholderES.parentPrototype.load.call(this, experienceStreamId);
            this.setState(rin.contracts.experienceStreamState.ready);

            var esInfo = this._orchestrator.debugOnlyGetESItemInfo();
            if (esInfo) {
                rin.util.assignAsInnerHTMLUnsafe(this._userInterfaceControl.firstChild, "Placeholder ES for {0}:{1} <br/> Lifetime {2}-{3}".rinFormat(esInfo.providerId, esInfo.id,
                    esInfo.beginOffset, esInfo.endOffset));
            }
        }
    };

    rin.util.overrideProperties(PlaceholderES.prototypeOverrides, PlaceholderES.prototype);
    PlaceholderES.elementHTML = "<div style='position:absolute;width:100%;height:100%'><div style='color:red;position:absolute;width:100%;height:100%'></div><div style='color:white;position:absolute;right:20px;top:20px;' class='rinPlaceholderValue'></div></div>";
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.PlaceholderExperienceStream", function (orchestrator, esData) { return new PlaceholderES(orchestrator, esData); });
    rin.ext.setDefaultFactory(rin.contracts.systemFactoryTypes.esFactory, function (orchestrator, esData) { return new PlaceholderES(orchestrator, esData); });
})(rin);
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../core/Common.js"/>
/// <reference path="../core/Utils.js"/>
/// <reference path="../core/TaskTimer.js"/>
/// <reference path="../core/ESItem.js"/>
/// <reference path="../core/ESTimer.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/ScreenPlayInterpreter.js"/>
/// <reference path="../core/Orchestrator.js"/>
/// <reference path="../core/ESItemsManager.js"/>
/// <reference path="../core/EventLogger.js"/>

window.rin = window.rin || {};

rin.internal.DefaultPreloaderES = function () {
    this._currentPreloadList = new rin.internal.List();
    this.stateChangedEvent = new rin.contracts.Event();
    this._preloaderTimer = new rin.internal.Timer();
};

rin.internal.DefaultPreloaderES.prototype = {
    _orchestrator: null,
    _stageControl: null,
    _esListInfo: null,
    _currentPreloadList: null,
    _preloaderTimer: null,
    _defaultPreloadingTime: 30,
    _defaultInitialMinRequiredBuffering: 9.5,
    _state: rin.contracts.experienceStreamState.closed,
    _allNarrativeESItems: null,

    stateChangedEvent: new rin.contracts.Event(),
    getUserInterfaceControl: function () { return null; },
    isPreloader: true,
    isSystemES: true,
    initialize: function (orchestrator, stageControl, esInfoList, allNarrativeESItems) {
        this._orchestrator = orchestrator;
        this._stageControl = stageControl;
        this._esListInfo = esInfoList;
        this._allNarrativeESItems = allNarrativeESItems;

        this._preloaderTimer.interval = 1000;
        var self = this;
        this._preloaderTimer.tick = function () { self._preloaderTimer_Tick(); };
        this._addListenersToAllItems();
    },

    updateScreenPlay: function (newESListInfo) {
        this._preloaderTimer.stop();
        this._removeListenersToAllItems();
        this._esListInfo = newESListInfo;
        this.load(0);
    },

    load: function (experienceStreamId) {
        this._updateCurrentPreloadList(0, this._defaultPreloadingTime);
        this._preloadCurrentItems(0, true);
        this._preloaderTimer.start();
    },

    pause: function (offset, experienceStreamId) {
        this._seek(offset, experienceStreamId);
    },

    play: function (offset, experienceStreamId) {
        this._seek(offset, experienceStreamId);
    },

    unload: function () {
        this._preloaderTimer.stop();
    },

    getPreloaderItemStatesInfo: function () { //todo
    },

    getState: function () {
        return this._state;
    },

    setState: function (value) {
        if (this._state == value) return;
        var previousState = this._state;
        this._state = value;
        this.stateChangedEvent.publish(new rin.contracts.ESStateChangedEventArgs(previousState, value, this));
    },

    _preloaderTimer_Tick: function () {
        var currentTime = this._orchestrator.getCurrentLogicalTimeOffset();
        this._preloadItems(currentTime);
    },

    _preloadItems: function (offset) {
        this._updateCurrentPreloadList(offset, offset + this._defaultPreloadingTime);
        this._preloadCurrentItems(offset, false);
    },

    _addListenersToAllItems: function () {
        var items = this._esListInfo.getESItems();
        var self = this;
        items.foreach(function (item) {
            item.experienceStream.stateChangedEvent.subscribe(function (args) { self._experienceStream_ESStateChanged(args) }, "preloader");
        });
    },

    _removeListenersToAllItems: function () {
        var items = this._esListInfo.getESItems();
        items.foreach(function (item) {
            item.experienceStream.stateChangedEvent.unsubscribe("preloader");
        });
    },

    _experienceStream_ESStateChanged: function (esStateChangedEventArgs) {
        var sourceES = esStateChangedEventArgs.source;
        if (sourceES == this || sourceES.isPreloader) return;

        if (esStateChangedEventArgs.toState == rin.contracts.experienceStreamState.error) {
            var es = this._esListInfo.getESItems().firstOrDefault(function (item) { return item.experienceStream == sourceES });
            var esName = es ? es.id : "";
            var esType = es ? es.esData.providerId : "NotAvailable";
            this._orchestrator.eventLogger.logErrorEvent("ES {0} of type {1} went to error state in preloader.".rinFormat(esName, esType));
        }
        this._checkCurrentPreloadListStates();
    },

    _checkCurrentPreloadListStates: function () {
        if (this._areAllItemsPreloaded(this._currentPreloadList)) this.setState(rin.contracts.experienceStreamState.ready);
    },

    _updateCurrentPreloadList: function (offset, endOffset) {
        var preloadList = this._esListInfo.getESItems(offset, endOffset);
        this._currentPreloadList = preloadList.where(function (item) { return item.experienceStream != this });
    },

    _preloadCurrentItems: function (offset, bufferIfNotAllLoaded) {
        var esInfoList = this._currentPreloadList;
        rin.internal.debug.assert(!esInfoList.firstOrDefault(function (i) { return i.experienceStream == this }));

        if (this._areAllItemsPreloaded(esInfoList)) {
            this.setState(rin.contracts.experienceStreamState.ready);

            if (this._isGreedyBufferingCompleted || this._orchestrator.playerConfiguration.isGreedyBufferingDisabled) return;

            var esItemToBuffer = this._getNextESItemToBuffer(offset);
            if (!esItemToBuffer) {
                return;
            }
            else {
                esInfoList.push(esItemToBuffer);
                bufferIfNotAllLoaded = false;
            }
        }

        if (bufferIfNotAllLoaded) this.setState(rin.contracts.experienceStreamState.buffering);

        for (var i = 0; i < esInfoList.length; i++) {
            var esInfo = esInfoList[i];
            this._orchestrator.ensureExperienceStreamIsLoaded(esInfo);

            var contentControl = esInfo.experienceStream.getUserInterfaceControl();

            if (contentControl && !rin.util.hasChildElement(this._stageControl.childNodes, contentControl)) {
                rin.util.hideElementByOpacity(contentControl);
                contentControl.style.zIndex = -1;
                contentControl.style.position = "absolute";
                this._stageControl.appendChild(contentControl);
            }
        }
    },

    _areAllItemsPreloaded: function (esInfoList) {
        for (var i = 0, len = esInfoList.length; i < len; i++) {
            var state = esInfoList[i].experienceStream.getState();
            if (!state || state == rin.contracts.experienceStreamState.buffering ||
                state == rin.contracts.experienceStreamState.closed) return false;
        }
        return true;
    },

    _seek: function (offset, experienceStreamId) {
        var epsilon = .05;
        if (Math.abs(this._orchestrator.getCurrentLogicalTimeOffset() - offset) < epsilon) return;
        this._preloadItems(offset);
    },

    _getNextESItemToBuffer: function (offset) {
        var firstItemToBuffer = this._getNextNotLoadedOrBufferingItem(offset);
        if (!firstItemToBuffer) {
            // Now check if there is something else in whole timeline to buffer. Something before current offset might be non-loaded in case of seek.
            firstItemToBuffer = this._getNextNotLoadedOrBufferingItem(0);
            if (!firstItemToBuffer) {
                this._onGreedyBufferingCompleted();
                return null; // nothing to buffer anymore.
            }
        }

        if (firstItemToBuffer.experienceStream.getState() == rin.contracts.experienceStreamState.buffering) return null; // something is already buffering, do not buffer additional ones yet.
        rin.internal.debug.assert(this._orchestrator.isExperienceStreamLoaded(firstItemToBuffer.id) == false);
        this._orchestrator.eventLogger.logEvent("Preloader greedy buffer {0} at offset {1}.", firstItemToBuffer.id, firstItemToBuffer.beginOffset);
        return firstItemToBuffer;
    },

    _onGreedyBufferingCompleted: function () {
        /* When we need to buffer addional items like console, add that code here. */
        this._isGreedyBufferingCompleted = true;
    },

    _getNextNotLoadedOrBufferingItem: function (offset) {
        var allESItems = this._esListInfo.getESItems();
        for (var i = 0, len = allESItems.length; i < len; i++) {
            var es = allESItems[i];
            if (es.beginOffset >= offset && this._isBufferingOrNonLoadedESItem(es)) return es;
        }

        if (!this._allNarrativeESItems) return;

        var allNarrativeESItems = this._allNarrativeESItems;
        var lastESItem = allESItems.lastOrDefault();
        var lastESItemPos = lastESItem ? this._allNarrativeESItems.indexOf(lastESItem) : 0;
        rin.internal.debug.assert(lastESItemPos >= 0);

        for (var i = lastESItemPos, len = allNarrativeESItems.length; i < len; i++) {
            var es = allNarrativeESItems[i];
            if (this._isBufferingOrNonLoadedESItem(es)) return es;
        }

        for (var i = 0; i < lastESItemPos; i++) {
            var es = allNarrativeESItems[i];
            if (this._isBufferingOrNonLoadedESItem(es)) return es;
        }
    },

    _isBufferingOrNonLoadedESItem: function (esItem) {
        var esState = esItem.experienceStream.getState();
        return esState == rin.contracts.experienceStreamState.buffering || !this._orchestrator.isExperienceStreamLoaded(esItem.id);
    },

    _allNarrativeESItems: null

};
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../core/Common.js"/>
/// <reference path="../core/TaskTimer.js"/>
/// <reference path="../core/ESItem.js"/>
/// <reference path="../core/ESTimer.js"/>
/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/ScreenPlayInterpreter.js"/>
/// <reference path="../core/Orchestrator.js"/>
/// <reference path="../core/ESItemsManager.js"/>
/// <reference path="../core/EventLogger.js"/>
/// <reference path="../player/DefaultController.js" />
/// <reference path="../player/ControllerViewModel.js"/>

window.rin = window.rin || {};

rin.internal.PlayerControllerES = function () {
    "use strict";
    this.stateChangedEvent = new rin.contracts.Event();
};

rin.internal.PlayerControllerES.prototype = {
    isSystemES: true,
    orchestrator: null,
    _playerController: null,
    _playerControllerViewModel: null,

    initialize: function (playerElement, playerConfiguration) {
        "use strict";
        var self = this,
            stageElement,
            playPauseVM,
            seekerVM,
            volumeVM,
            troubleshootVM,
            playerControllerControl,
            onNarrativeLoaded = function () {
                var systemRoot = self.orchestrator.getResourceResolver().resolveSystemResource("");
                self._playerControllerViewModel.initialize();
                rin.defLoader = rin.defLoader || new rin.internal.DeferredLoader();
                rin.defLoader.loadAllThemeResources(systemRoot).then(function () {
                    self._playerController = new rin.internal.ui.DefaultController(self._playerControllerViewModel);

                    //Hide the seeker if the narrative duration is 0 or not available
                    if (!self.orchestrator.getNarrativeInfo().totalDuration) {
                        self._playerControllerViewModel.isSeekerVisible(false);
                        self._playerControllerViewModel.isPlayPauseVisible(false);
                        self._playerControllerViewModel.isVolumeVisible(false);
                    }

                    self._playerController.initStageArea(self.playerControl.getStageControl(), self.playerControl.getPlayerRoot());
                    playerControllerControl = self._playerController.getUIControl();
                    self._playerController.volumeChangedEvent.subscribe(function (value) {
                        volumeVM.setVolumeInPercent(value);
                    });
                    self._playerController.seekTimeChangedEvent.subscribe(function (value) {
                        seekerVM.setSeekPositionPercent(value);
                    });
                    self._playerController.showControlsEvent.subscribe(function () {
                        self._playerControllerViewModel.showFooterControls(true);
                    });
                    self._playerController.hideControlsEvent.subscribe(function () {
                        if (self.orchestrator.getPlayerState() !== rin.contracts.playerState.pausedForExplore) {
                            if (playPauseVM.isPlaying()) {
                                self._playerControllerViewModel.showFooterControls(false);
                            }
                        }
                    });
                    self._playerController.showHideTroubleShootingControls.subscribe(function (isShow) {
                        self._playerControllerViewModel.changeTroubleShootControlsVisibilty(isShow);
                    });
                    self._playerControllerViewModel.troubleShooterVM.startSeekPositionUpdater();
                    self._playerControllerViewModel.seekerVM.startSeekPositionUpdater();
                });
            };

        stageElement = document.createElement("div");
        stageElement.style.position = "relative";
        stageElement.style.width = "100%";
        stageElement.style.height = "100%";

        this.playerControl = new rin.internal.PlayerControl(stageElement, playerConfiguration, playerElement);
        this.orchestrator = this.playerControl.orchestrator;
        this._playerControllerViewModel = new rin.internal.PlayerControllerViewModel(this.orchestrator, this.playerControl);
        playPauseVM = this._playerControllerViewModel.playPauseVM;
        seekerVM = this._playerControllerViewModel.seekerVM;
        volumeVM = this._playerControllerViewModel.volumeVM;
        troubleshootVM = this._playerControllerViewModel.troubleShooterVM;

        this.orchestrator.narrativeLoadedEvent.subscribe(onNarrativeLoaded, null, this);
        this._playerControllerViewModel.interactionControls.subscribe(function () {
            var interactionControls = self._playerControllerViewModel.interactionControls();
            self._playerController.setInteractionControls(interactionControls);
        });

    },
    load: function (experienceStreamId) {
        "use strict";
    },
    play: function (offset, experienceStreamId) {
        "use strict";
        this._playerControllerViewModel.playPauseVM.isPlaying(true);
    },
    pause: function (offset, experienceStreamId) {
        "use strict";
        this._playerControllerViewModel.playPauseVM.isPlaying(false);
    },
    unload: function () {
        "use strict";
        this._playerControllerViewModel.seekerVM.stopSeekPositionUpdater();
        this._playerControllerViewModel.troubleShooterVM.stopSeekPositionUpdater();
    },
    getState: function () {
        "use strict";
        return rin.contracts.experienceStreamState.ready;
    },
    stateChangedEvent: null,
    getUserInterfaceControl: function () {
        "use strict";
        return null;
    },
    getControllerVM: function () {
        "use strict";
        return this._playerControllerViewModel;
    },
    playerControl: null
};
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/IExperienceStream.js"/>
/// <reference path="../core/Common.js"/>
/// <reference path="../core/ESItem.js"/>
/// <reference path="../core/EventLogger.js"/>
/// <reference path="../core/Orchestrator.js"/>
/// <reference path="../core/PlayerConfiguration.js"/>
/// <reference path="../core/PlayerControl.js"/>
/// <reference path="../core/ResourcesResolver.js"/>
/// <reference path="../core/RinDataProxy.js"/>
/// <reference path="../core/ScreenPlayInterpreter.js"/>
/// <reference path="../core/StageAreaManager.js"/>
/// <reference path="../core/TaskTimer.js"/>
/// <reference path="../player/ControllerViewModel.js"/>

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};
rin.internal.ui = rin.internal.ui || {};

rin.internal.ui.DefaultController = function (viewModel) {
    var self = this,
        playerControllerElement = null,
        playerControllerElementHtml = null,
        stageControl = null,
        interactionControlsWrap = null,
        playPauseControl,
        volumeControl,
        timelineControl,
        fullScreenControl,
        troubleShooterControl,
        createChildControls = function () {
            var playPauseUIControl = $(".rin_PlayPauseContainer", playerControllerElement),
                volumeUIControl = $(".rin_VolumeControl", playerControllerElement),
                timelineUIControl = $(".rin_TimelineHolder", playerControllerElement),
                fullScreenUIControl = $(".rin_FullScreenControl", playerControllerElement),
                troubleShooterUIControl = $(".rin_TroubleShooterControlHolder", playerControllerElement),
                startExploringUIControl = $(".rin_startExploring", playerControllerElement);

            playPauseControl = new rin.internal.ui.PlayPauseControl(playPauseUIControl, viewModel.playPauseVM);
            volumeControl = new rin.internal.ui.VolumeControl(volumeUIControl, viewModel.volumeVM);
            timelineControl = new rin.internal.ui.SeekerControl(timelineUIControl, viewModel.seekerVM);
            fullScreenControl = new rin.internal.ui.FullScreenControl(fullScreenUIControl, self.getUIControl());
            troubleShooterControl = new rin.internal.ui.TroubleShootingControl(troubleShooterUIControl, playerControllerElement, interactionControlsWrap, viewModel.troubleShooterVM);
            fullScreenControl = new rin.internal.ui.FullScreenControl(fullScreenUIControl, self.getUIControl());
            startExploringControl = new rin.internal.ui.StartExploringControl(startExploringUIControl, viewModel);

            volumeControl.volumeChangedEvent.subscribe(function (value) {
                self.volumeChangedEvent.publish(value);
            });
            timelineControl.seekTimeChangedEvent.subscribe(function (value) {
                self.seekTimeChangedEvent.publish(value);
            });
        },
        hookEvents = function () {
            var CONST_CONTROL_TIMER_MS = 5000,
                controlTimerId,
                resetControlTimer = function (timerId, onTimeOut) {
                    timerId && clearTimeout(timerId);
                    timerId = setTimeout(onTimeOut, CONST_CONTROL_TIMER_MS);
                    return timerId;
                };

            var onShowControls = function () {
                self.showControlsEvent.publish();
                controlTimerId = resetControlTimer(controlTimerId, function () {
                    self.hideControlsEvent.publish();
                    volumeControl && volumeControl.volumeSlider.hideSlider();
                });
            };

            /*Custom Events Start*/
            playerControllerElement.bind("showHideTroubleShootingControls", function (type, isShow) {
                self.showHideTroubleShootingControls.publish(isShow);
            });
            /*Custom Events End*/

            playerControllerElement.mousemove(function (event) {
                onShowControls();
            });
            playerControllerElement.mouseover(function (event) {
                onShowControls();
            });
        };

    //******************************Exposed as Public Members Start ********************************/
    this.showControlsEvent = new rin.contracts.Event();
    this.hideControlsEvent = new rin.contracts.Event();
    this.volumeChangedEvent = new rin.contracts.Event();
    this.seekTimeChangedEvent = new rin.contracts.Event();
    this.showHideTroubleShootingControls = new rin.contracts.Event();

    this.isSystemES = true;
    this.initStageArea = function (stageElement, playerRoot) {
        ko.renderTemplate("Controller.tmpl", viewModel, null, playerRoot);
        playerControllerElement = $(".rin_mainContainer", playerRoot);
        stageControl = $(".rin_ExperienceStream", playerControllerElement);
        stageControl.append(stageElement);

        // Disable event propogation
        var cancelTouch = function (e) {
            e.stopPropagation();
            e.cancelBubble = true;
        }
        // Disable touch events so that on IE 10 RT the browser will not switch to the next tab on a horizontal swipe.
        stageElement.addEventListener("MSPointerDown MSPointerMove MSPointerUp", cancelTouch, false);

        interactionControlsWrap = $(".rin_InteractiveContainer", playerControllerElement);
        createChildControls();
        hookEvents();
    };

    this.setInteractionControls = function (controls) {
        interactionControlsWrap.children().detach();
        controls && interactionControlsWrap && interactionControlsWrap.append(controls);
    };

    this.getUIControl = function () {
        playerControllerElementHtml = playerControllerElementHtml || playerControllerElement[0];
        return playerControllerElementHtml;
    };
    this.setVM = function (viewModel) {
        ko.bindingHandlers.stopBinding = {
            init: function () {
                return { controlsDescendantBindings: true };
            }
        };
        ko.virtualElements.allowedBindings.stopBinding = true;
        ko.applyBindings(viewModel, this.getUIControl());
        playPauseControl.setVM(viewModel.playPauseVM);
        volumeControl.setVM(viewModel.volumeVM);
        timelineControl.setVM(viewModel.seekerVM);
        troubleShooterControl.setVM(viewModel.troubleShooterVM);
    };
    //******************************Exposed as Public Members End ********************************/
};

rin.internal.ui.SliderBase = function (controlPlaceHolder, controlElement, isVertical, viewModel) {

    if (isVertical) {
        ko.renderTemplate('VerticalSliderControl.tmpl', viewModel, null, controlPlaceHolder.get(0));
    }
    else {
        ko.renderTemplate('HorizontalSliderControl.tmpl', viewModel, null, controlPlaceHolder.get(0));
    }

    var CONST_CONTROL_TIMER_MS = 1500,
        thumbSelected = false,
        self = this,
        controlTimerId,
        resetControlTimer = function (timerId, onTimeOut) {
            timerId && clearTimeout(timerId);
            timerId = setTimeout(onTimeOut, CONST_CONTROL_TIMER_MS);
            return timerId;
        };
    var isSliderVisible = false;

    this.sliderContainer = $(".rin_SliderContainer", controlPlaceHolder);
    this.slider = $(".rin_Slider", controlPlaceHolder);

    this.valueChangedEvent = new rin.contracts.Event();

    /* Custom Events*/
    this.showSlider = function (type, event) {
        self.sliderContainer.show();
        isSliderVisible = true;
    };

    this.hideSlider = function (type, event) {
        self.sliderContainer.hide();
        isSliderVisible = false;
    };

    this.sliderContainer.bind("changeValue", function (type, event) {
        var sliderOffset = self.sliderContainer.offset(),
            sender = event.currentTarget,
            valueInPercent;
        if (isVertical) {
            valueInPercent = 100 - ((event.pageY - sliderOffset.top) * 100 / sender.clientHeight);
        }
        else {
            valueInPercent = (event.pageX - sliderOffset.left) * 100 / sender.clientWidth;
        }
        self.valueChangedEvent.publish(valueInPercent);
        event.preventDefault();
        event.stopPropagation();
    });
    /* Custom Events*/
    controlPlaceHolder.mouseover(function (event) {
        controlTimerId && clearTimeout(controlTimerId);
        self.showSlider();
    });

    this.sliderContainer.mousemove(function (event) {
        if (thumbSelected) {
            self.sliderContainer.trigger("changeValue", event);
        }
        event.preventDefault();
    });

    this.sliderContainer.mouseup(function (event) {        
        if (thumbSelected) {
            self.sliderContainer.trigger("changeValue", event);
            thumbSelected = false;
        }
    });

    this.sliderContainer.mousedown(function (event) {        
        thumbSelected = true;
        self.sliderContainer.trigger("changeValue", event);
    });

    this.sliderContainer.mouseleave(function (event) {
        thumbSelected = false;
    });

    if (controlElement) {
        //If a controlling element is passed, then the slider is to be shown only on its hover
        //like a volume control

        controlElement.mouseover(function (event) {
            controlTimerId && clearTimeout(controlTimerId);
            self.showSlider();
        });

        controlPlaceHolder.mouseleave(function (event) {
            controlTimerId = resetControlTimer(controlTimerId, function () {
                self.hideSlider();
            });
        });

        controlElement.mouseleave(function (event) {
            controlTimerId = resetControlTimer(controlTimerId, function () {
                self.hideSlider();
            });
        });

        this.hideSlider();
    }
};

rin.internal.ui.VerticalSlider = function (controlPlaceHolder, controlElement, viewModel) {
    return new rin.internal.ui.SliderBase(controlPlaceHolder, controlElement, true, viewModel);
};

rin.internal.ui.HorizontalSlider = function (controlPlaceHolder, controlElement, viewModel) {
    return new rin.internal.ui.SliderBase(controlPlaceHolder, controlElement, false, viewModel);
};

rin.internal.ui.PlayPauseControl = function (control, viewModel) {
    ko.renderTemplate('PlayPauseControl.tmpl', viewModel, null, control.get(0));
    this.setVM = function (viewModel) {
        ko.applyBindings(viewModel, control.get(0));
    }
};

rin.internal.ui.VolumeControl = function (control, viewModel) {
    ko.renderTemplate('VolumeControl.tmpl', viewModel, null, control.get(0));

    var volumeControlSlider = $(".rin_VolumeSliderPlaceHolder", control),
        volumeButton = $(".rin_Button", control),
        self = this;

    this.volumeSlider = new rin.internal.ui.VerticalSlider(volumeControlSlider, volumeButton, viewModel);
    this.volumeChangedEvent = rin.contracts.Event();
    this.volumeSlider.valueChangedEvent.subscribe(function (value) {
        self.volumeChangedEvent.publish(value);
    });
    this.setVM = function (viewModel) {
        ko.applyBindings(viewModel, control.get(0));
    };
};

rin.internal.ui.SeekerControl = function (control, viewModel) {
    var self = this;
    this.timelineSlider = new rin.internal.ui.HorizontalSlider(control, null, viewModel);
    this.seekTimeChangedEvent = rin.contracts.Event();
    this.timelineSlider.valueChangedEvent.subscribe(function (value) {
        self.seekTimeChangedEvent.publish(value);
    });
    this.setVM = function (viewModel) {
        ko.applyBindings(viewModel, control.get(0));
    };
};

rin.internal.ui.FullScreenControl = function (controlRoot, htmlElement) {
    ko.renderTemplate('FullScreenControl.tmpl', null, null, controlRoot.get(0));

    var playerResizeEvent = document.createEvent('HTMLEvents');
    playerResizeEvent.initEvent('resize', false, false);
    playerResizeEvent.data = {};

    var self = this,
        button = $(".rin_Button", controlRoot),
        control = $(htmlElement),
        isFullScreen = false,
        inFullScreenMode = function () {
            if (htmlElement.requestFullScreen)
                return document.fullscreenElement;
            if (htmlElement.mozRequestFullScreen)
                return document.mozFullScreen;
            if (htmlElement.webkitRequestFullScreen)
                return document.webkitIsFullScreen;
            return isFullScreen;
        },
        toggleFullScreen = function () {
            if (inFullScreenMode()) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                else {
                    htmlElement.removeEventListener('keydown', escListener, false);
                    document.removeEventListener('keydown', escListener, false);
                    isFullScreen = false;
                }
            }
            else {
                if (htmlElement.requestFullScreen) {
                    htmlElement.requestFullScreen();
                } else if (htmlElement.mozRequestFullScreen) {
                    htmlElement.mozRequestFullScreen();
                } else if (htmlElement.webkitRequestFullScreen) {
                    htmlElement.webkitRequestFullScreen();
                }
                else {
                    htmlElement.addEventListener('keydown', escListener, false);
                    document.addEventListener('keydown', escListener, false);
                    isFullScreen = true;
                }
            }
            toggleFullScreenResources();

            htmlElement.dispatchEvent(playerResizeEvent);
        },
        escListener = function (e) {
            if (e && e.keyCode && e.keyCode === 27) { toggleFullScreen(); }
        },
        toggleFullScreenResources = function (event) {
            if (inFullScreenMode()) {
                button.removeClass('rin_RestoreScreen');
                button.addClass('rin_FullScreen');
                var parent = control.parent();
                if (parent)
                    parent.addClass('rin_FullScreenContent');
                else
                    control.addClass('rin_FullScreenContent');
            }
            else {
                button.addClass('rin_RestoreScreen');
                button.removeClass('rin_FullScreen');
                var parent = control.parent();
                if (parent)
                    parent.removeClass('rin_FullScreenContent');
                else
                    control.removeClass('rin_FullScreenContent');
            }
        };

    document.addEventListener('fullscreenchange', toggleFullScreenResources, false);
    document.addEventListener('mozfullscreenchange', toggleFullScreenResources, false);
    document.addEventListener('webkitfullscreenchange', toggleFullScreenResources, false);

    button.click(function (event) {
        toggleFullScreen();
    });
};

rin.internal.ui.TroubleShootingControl = function (controlRoot, controlParent, interactionControlsWrap, viewModel) {
    ko.renderTemplate('TroubleShooter.tmpl', viewModel, null, controlRoot.get(0));

    // todo: Gautham: Use RinEvents for communication between controls instead of jquery events
    controlParent.keydown(function (event) {
        if (
            ((event.key && event.key.toLowerCase() === "t") ||
             (event.keyCode && (event.keyCode === 84 || event.keyCode === 116)))
            && event.shiftKey) {
            controlParent.trigger("showHideTroubleShootingControls");
        }
        else if (
            ((event.key && event.key.toLowerCase() === "d") ||
             (event.keyCode && event.keyCode === 68 ))
            && event.shiftKey) {
            controlParent.trigger("showHideTroubleShootingControls", true);
            viewModel.showControls(true);
            viewModel.isHeaderVisible(true);
            viewModel.showdeepstateDialogClick();
            viewModel.captureDeepStateClick();
        }
    });
    viewModel.interactionEvent.subscribe(function () {
        var elements = $(":visible", interactionControlsWrap), elementsList, index, opCode;
        if (elements && elements.length) {
            elementsList = new rin.internal.List();
            for (index = 0; index < elements.length; index++) {
                elementsList.push($(elements[index]));
            }
            elementsList = elementsList.filter(function (item) {
                return item && item[0] && $._data(item[0], "events")
            });
            if (elementsList && elementsList.length) {
                opCode = rin.util.randInt(0, elementsList.length - 1);
                elementsList[opCode].trigger('click');
            }
        }
    });

    this.setVM = function (viewModel) {
        ko.applyBindings(viewModel, controlRoot.get(0));
    };
};

rin.internal.ui.StartExploringControl = function ($control, viewModel) {
    
    $control.on('click', function () {
         
        // enable interactive mode
        viewModel.startInteractionMode();

        // raise a custom jQuery event that can be subscribed to on the page
        $.event.trigger('rin.startExploring');

    });
};

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/Common.js">
/// <reference path="../core/Orchestrator.js">
/// <reference path="../utilities/SelfTest.js">

window.rin = window.rin || {};

rin.internal.getDeepState = function (deepstateParameter, narrativeUrl) {
    var deepstateUrl = "narrativeUrl={0}&begin={1}&action={2}&screenPlayId={3}".rinFormat(
        encodeURIComponent(rin.util.convertToAbsoluteUri(narrativeUrl)), // ger absolute url for the narrative
        deepstateParameter.state.animation.begin, deepstateParameter.state.animation.action, deepstateParameter.state.document.screenplayId);
    deepstateUrl += "&state={0}".rinFormat(encodeURIComponent(JSON.stringify(deepstateParameter.state.collectionReferences)));
    var queryStringStart = window.location.href.indexOf("?");
    deepstateUrl = (queryStringStart > 0 ?  window.location.href.substr(0,queryStringStart) : window.location.href) + "?" + deepstateUrl;
    return deepstateUrl;
};

rin.internal.PlayerControllerViewModel = function (orchestrator, playerControl) {
    var showControls = ko.observable(false),
        isPlayerReady = ko.observable(false),
        isHeaderVisible = ko.observable(false),
        isPlayPauseVisible = ko.observable(true),
        isInteractiveControlVisible = ko.observable(true),
        isRightContainerVisible = ko.observable(true),
        areShareButtonsVisible = ko.observable(true),
        isVolumeVisible = ko.observable(true),
        isSeekerVisible = ko.observable(true),
        isFullScreenControlVisible = ko.observable(true),
        areTroubleShootControlsVisible = ko.observable(false),
        interactionControls = ko.observable(null),
        title = ko.observable(""),
        branding = ko.observable(""),
        description = ko.observable(""),
        seekerViewModel = new rin.internal.SeekerControllerViewModel(orchestrator, playerControl),
        playPauseViewModel = new rin.internal.PlayPauseControllerViewModel(orchestrator, playerControl),
        volumeControlViewModel = new rin.internal.VolumeControllerViewModel(orchestrator, playerControl),
        debugCurrentTime = ko.observable("0:00"),        
        troubleShooterViewModel = new rin.internal.TroubleShooterViewModel(orchestrator, playerControl),
        seekToBeginningOnEnd = false,
        shareLinks = ko.observableArray([
            new rin.internal.MailDataViewModel(orchestrator)
        ]),
        removeInteractionControls = function () {
            interactionControls(null);
        },
        setInteractionControls = function (currentInteractingES) {
            if (typeof currentInteractingES.getInteractionControls === 'function') {
                interactionControls(currentInteractingES.getInteractionControls());
            }
        },
        onPlayerReadyChanged = function (value) {
            if (true === value || false === value) {
                isPlayerReady(value);
            } else {
                rin.internal.debug.assert(false, "Boolean expected. Recieved: " + value.toString());
            }
        },
        onPlayerStateChanged = function (playerStateChangedEventArgs) {
            switch (playerStateChangedEventArgs.currentState) {
                case rin.contracts.playerState.playing:
                    removeInteractionControls();
                    break;
            }
        },
        onInteractionModeStarted = function (eventArgs) {
            setInteractionControls(eventArgs.interactionES);
        },
        onNarrativeModeStarted = function (eventArgs) {
            // todo: hide player controls here.
        },
        onScreenplayEnded = function (eventArgs) {
            if (seekToBeginningOnEnd) orchestrator.pause(0);
        },
        onSeekChanged = function (eventArgs) {
            removeInteractionControls();
            showFooterControls(true);
        },
        showFooterControls = function (isShow) {
            if (isShow) {
                // Check if current screenplay supports showing footer controls
                var screenPlayId = orchestrator.currentScreenPlayId
                var screenPlayPropertyTable = orchestrator.getScreenPlayPropertyTable(screenPlayId);
                var hideTimeline = screenPlayPropertyTable && screenPlayPropertyTable.isTransitionScreenPlay;
                showControls(isShow && !hideTimeline);
            } else {
                showControls(false);
            }
            
        }
        setControllerOptions = function () {
            var controllerOptions = orchestrator.playerConfiguration.controllerOptions || {};
            if (controllerOptions.header !== undefined)
                isHeaderVisible(controllerOptions.header);

            if (controllerOptions.playPause !== undefined)
                isPlayPauseVisible(controllerOptions.playPause);

            if (controllerOptions.share !== undefined)
                areShareButtonsVisible(controllerOptions.share);

            if (controllerOptions.fullscreen !== undefined)
                isFullScreenControlVisible(controllerOptions.fullscreen);

            if (controllerOptions.seeker !== undefined)
                isSeekerVisible(controllerOptions.seeker);

            if (controllerOptions.volume !== undefined)
                isVolumeVisible(controllerOptions.volume);

            seekToBeginningOnEnd = !!controllerOptions.seekToBeginningOnEnd;
        },
        toggleControls = function () {
            if (orchestrator.playerConfiguration.playerMode === rin.contracts.playerMode.AuthorerPreview && !orchestrator.playerConfiguration.isFromRinPreviewer) {
                isPlayPauseVisible(false);
                areShareButtonsVisible(false);
                isFullScreenControlVisible(false);
                isSeekerVisible(false);
            }
            else if (orchestrator.playerConfiguration.playerMode === rin.contracts.playerMode.AuthorerEditor) {
                isPlayPauseVisible(false);
                isRightContainerVisible(false);
                isHeaderVisible(false);
                isSeekerVisible(false);
            }
        },
        changeTroubleShootControlsVisibilty = function (isShow) {
            if (typeof (isShow) == "boolean") {
                areTroubleShootControlsVisible(isShow);
                isHeaderVisible(isShow);
            }
            else if (areTroubleShootControlsVisible()) {
                areTroubleShootControlsVisible(false);
                isHeaderVisible(false);
            }
            else {
                areTroubleShootControlsVisible(true);
                isHeaderVisible(true);
            }
        },
        debugPrintCurrentTime = function () {
            if (orchestrator._rinData == null) {
                clearInterval(debugCurrentTimeTimerId);
            }
            var currentTime = orchestrator ? orchestrator.getCurrentLogicalTimeOffset() : 0;
            var minutes = Math.floor(currentTime / 60);
            var seconds = Math.floor(currentTime % 60);
            var currentTimeString = minutes + ":" + (seconds < 10 ? "0":"") + seconds;
            debugCurrentTime(currentTimeString);
        },
        debugCurrentTimeTimerId = null,
        startInteractionMode = function () {
            orchestrator.startInteractionMode();
        },
        initialize = function () {
            seekerViewModel.initialize();
            playPauseViewModel.initialize();
            volumeControlViewModel.initialize();
            troubleShooterViewModel.initialize();
            title(orchestrator.getNarrativeInfo().title || "");
            branding(orchestrator.getNarrativeInfo().branding || "");
            description(orchestrator.getNarrativeInfo().description || "");
            setControllerOptions();
            toggleControls();
            debugCurrentTimeTimerId = setInterval(debugPrintCurrentTime, 1000);
        };

    orchestrator.isPlayerReadyChangedEvent.subscribe(onPlayerReadyChanged, null, this);
    orchestrator.playerControl.interactionModeStarted.subscribe(onInteractionModeStarted, null, this);
    orchestrator.playerControl.narrativeModeStarted.subscribe(onNarrativeModeStarted, null, this);
    orchestrator.playerControl.screenplayEnded.subscribe(onScreenplayEnded, null, this);
    orchestrator.playerStateChangedEvent.subscribe(onPlayerStateChanged, null, this);
    orchestrator.narrativeSeekedEvent.subscribe(onSeekChanged, null, this);

    return {
        initialize: initialize,

        volumeVM: volumeControlViewModel,
        seekerVM: seekerViewModel,
        playPauseVM: playPauseViewModel,
        troubleShooterVM: troubleShooterViewModel,
        shareLinks: shareLinks,

        showFooterControls: showFooterControls,
        showControls: showControls,
        isHeaderVisible: isHeaderVisible,
        isPlayPauseVisible: isPlayPauseVisible,
        isInteractiveControlVisible: isInteractiveControlVisible,
        isRightContainerVisible: isRightContainerVisible,
        isVolumeVisible: isVolumeVisible,
        isSeekerVisible: isSeekerVisible,
        areShareButtonsVisible: areShareButtonsVisible,
        isFullScreenControlVisible: isFullScreenControlVisible,
        areTroubleShootControlsVisible: areTroubleShootControlsVisible,
        changeTroubleShootControlsVisibilty: changeTroubleShootControlsVisibilty,

        isPlayerReady: isPlayerReady,
        interactionControls: interactionControls,
        title: title,
        branding: branding,
        description: description,
        debugCurrentTime: debugCurrentTime,
        startInteractionMode: startInteractionMode
    };
};

rin.internal.VolumeControllerViewModel = function (orchestrator, playerControl) {
    var isMuted = ko.observable(false),
        effectivePlayerVolumeLevelPercent = ko.observable("0%"),
        resetPlayerVolumeLevelPercent = function () {
            var effectiveVolume = 0, muteState = playerControl.mute();
            if (!muteState) {
                effectiveVolume = Math.round(playerControl.volume() * 100);
            }
            effectivePlayerVolumeLevelPercent(effectiveVolume + "%");
            isMuted(effectiveVolume <= 0);
        },
        setVolume = function (value) {
            var volumeIsZero = (value <= 0);
            isMuted(volumeIsZero);
            playerControl.volume(value);

            // changing the volume should unmute the orchestor, but
            // we don't want to mute the orchestrator if the volume
            // is zero - that is only reflected in UI
            if (playerControl.mute() && !volumeIsZero) {
                playerControl.mute(false);
            }

            resetPlayerVolumeLevelPercent();
        },
        setVolumeInPercent = function (value) {
            var actualValue = (value | 0) / 100;
            if (actualValue <= 0.05) {
                actualValue = 0;
            }
            setVolume(actualValue);
        },
        setMute = function (value) {
            playerControl.mute(value);
            isMuted(value);
            resetPlayerVolumeLevelPercent();
        },
        changeMuteState = function () {
            var newValue = !isMuted();
            setMute(newValue);
            return false;
        },
        initialize = function () {
            resetPlayerVolumeLevelPercent();
        };

    isMuted(playerControl.mute());
    resetPlayerVolumeLevelPercent();
    playerControl.volumeChangedEvent.subscribe(setVolume);
    playerControl.muteChangedEvent.subscribe(setMute);

    return {
        initialize: initialize,
        hoverValue: effectivePlayerVolumeLevelPercent,
        getValue: effectivePlayerVolumeLevelPercent,
        getVolumeLevelPercent: effectivePlayerVolumeLevelPercent,
        isMuted: isMuted,
        setVolumeInPercent: setVolumeInPercent,
        setMute: setMute,
        changeMuteState: changeMuteState
    };
};

rin.internal.SeekerControllerViewModel = function (orchestrator, playerControl) {
    var CONST_SEEKER_UPDATE_FREQ_MS = 500,
        seekTimer = null,
        seekPosition = 0,
        isSeekEnabled = true,
        narrativeDuration = 0,
        currentTime = ko.observable("0.00"),
        seekPositionPercent = ko.observable("0%"),
        onChangeSeekerPosition = function (value, fromSetter) {
            fromSetter = fromSetter || false;
            if (isSeekEnabled && seekPosition !== value) {
                seekPosition = value;
                narrativeDuration = orchestrator.getNarrativeInfo().totalDuration;
                currentTime((orchestrator.getCurrentLogicalTimeOffset() || 0).toFixed(2));
                seekPositionPercent(Math.round(seekPosition * 100) / 100 + "%");
                if (fromSetter) {
                    var seekToDuration = parseFloat(value) * narrativeDuration / 100,
                        playerState = orchestrator.getPlayerState();
                    if (playerState === rin.contracts.playerState.playing) {
                        playerControl.play(seekToDuration, null);
                    }
                    else {
                        playerControl.pause(seekToDuration, null);
                    }
                }
            }
        },
        setSeekPositionPercent = function (value) {
            if (parseFloat(value) !== seekPosition) {
                onChangeSeekerPosition(parseFloat(value), true);
            }
        },
        updateSeekPosition = function () {
            var currentOffset = orchestrator.getCurrentLogicalTimeOffset(),
                newSeekPosition;
            narrativeDuration = orchestrator.getNarrativeInfo().totalDuration;
            newSeekPosition = narrativeDuration < 0 ? 0 : (currentOffset * 100 / narrativeDuration);
            onChangeSeekerPosition(newSeekPosition, false);
        },
        startSeekPositionUpdater = function () {
            seekTimer = setInterval(updateSeekPosition, CONST_SEEKER_UPDATE_FREQ_MS);
        },
        stopSeekPositionUpdater = function () {
            clearInterval(seekTimer);
        },
        initialize = function () {            
            currentTime("0.00");
            setSeekPositionPercent("0");
        };

    return {
        initialize: initialize,
        isSeekEnabled: isSeekEnabled,
        hoverValue : currentTime,
        getValue: seekPositionPercent,
        getSeekPositionPercent: seekPositionPercent,
        setSeekPositionPercent: setSeekPositionPercent,
        startSeekPositionUpdater: startSeekPositionUpdater,
        stopSeekPositionUpdater: stopSeekPositionUpdater
    };
};

rin.internal.PlayPauseControllerViewModel = function (orchestrator,playerControl) {
    this.isPlaying = ko.observable();
    this.playPauseEvent = function () {
        var playerState = playerControl.getPlayerState();
        switch (playerState) {
            case rin.contracts.playerState.stopped:
            case rin.contracts.playerState.pausedForBuffering:
            case rin.contracts.playerState.pausedForExplore:
                playerControl.play();
                break;

            case rin.contracts.playerState.playing:
                playerControl.pause();
                break;

            default:
                rin.internal.debug.assert(false, "onPlayPause: Unrecognized player state = " + playerState);
                break;
        }
    };
    this.initialize = function () {
    };
};

rin.internal.TroubleShooterViewModel = function (orchestrator, playerControl) {
    var CONST_SEEKER_UPDATE_FREQ_MS = 500,
        self = this,
        minimumTimeInterval = ko.observable(),
        maximumTimeInterval = ko.observable(),
        selfTester = new rin.internal.SelfTester(orchestrator),
        seekTimer,
        resetControls = function () {
            self.showSelfTestDialog(false);
            self.showEditNarrativeDialog(false);
            self.showHypertimelines(false);
            self.showDeepstateDialog(false);
        },
        updateSeekPosition = function () {
            var currentOffset = orchestrator.getCurrentLogicalTimeOffset();
            self.currentTime(orchestrator.getCurrentLogicalTimeOffset());
        },
        getScreenplayIds = function (screenplays) {
            var scps = Object.keys(screenplays);
            return scps;
        };

    selfTester.logMessageEvent.subscribe(function (message) {
        self.logMessage(message);
    });

    this.interactionEvent = new rin.contracts.Event();
    this.logMessage = ko.observable("");
    this.useReload = ko.observable(false);

    this.showControls = ko.observable(true);
    this.showEditNarrativeDialog = ko.observable(false);
    this.showSelfTestDialog = ko.observable(false);
    this.showHypertimelines = ko.observable(false);
    this.selectedTimeline = ko.observable("");

    this.narrativeInfo = ko.observable(orchestrator._rinData);
    this.allScreenTimelines = ko.observableArray([]);
    this.showDeepstateDialog = ko.observable(false);
    this.capturedDeepState = ko.observable("");

    this.timeMin = ko.computed({
        read: function () {
            return minimumTimeInterval();
        },
        write: function (value) {
            if (!isNaN(value)) {
                minimumTimeInterval(value);
                selfTester.minimumTimeInterval = value;
            }
        }
    });
    this.timeMax = ko.computed({
        read: function () {
            return maximumTimeInterval();
        },
        write: function (value) {
            if (!isNaN(value)) {
                maximumTimeInterval(value);
                selfTester.maximumTimeInterval = value;
            }
        }
    });
    this.editNarrativeClick = function () {
        resetControls();
        this.showEditNarrativeDialog(true);
    };
    this.editCompleteClick = function () {
        orchestrator.load({ data: JSON.parse(this.narrativeInfo()) });
        resetControls();
    };
    this.editCancelClick = function () {
        this.narrativeInfo = ko.observable(JSON.stringify(orchestrator._rinData, null, "\t"));
        resetControls();
    };
    this.startSelfTestClick = function () {
        resetControls();
        var options = {
            deepstateReloadOption: self.useReload
        }
        selfTester.startSelfTest(options);
    };
    this.showSelfTestDialogClick = function () {
        resetControls();
        this.showSelfTestDialog(true);
    };
    this.showdeepstateDialogClick = function () {
        resetControls();
        this.showDeepstateDialog(true);
    };
    this.stopSelfTestClick = function () {
        resetControls();
        selfTester.stopSelfTest();
    };
    this.captureDeepStateClick = function () {
        var deepstateUrl = rin.internal.getDeepState(orchestrator.getDeepState(), orchestrator.playerControl.narrativeUrl);
        this.capturedDeepState(deepstateUrl);
        if (window.clipboardData) window.clipboardData.setData("Text", deepstateUrl);
    };
    this.showHypertimelineClick = function () {
        resetControls();
        this.showHypertimelines(true);
    };
    this.currentTime = ko.observable(0);
    this.totalDuration = ko.observable(0);
    this.timeControl = ko.computed({
        read: function () {
            return Math.round(self.currentTime() * 100) / 100 + "/" + Math.round(self.totalDuration() * 100) / 100;
        }
    });
    this.startSeekPositionUpdater = function () {
        seekTimer = setInterval(updateSeekPosition, CONST_SEEKER_UPDATE_FREQ_MS);
    };
    this.stopSeekPositionUpdater = function () {
        if(seekTimer)
            clearInterval(seekTimer);
    };
    selfTester.interactionEvent.subscribe(function () {
        self.interactionEvent.publish();
    });
    this.showHypertimelineClick = function () {
        resetControls();
        this.showHypertimelines(true);
    };
    this.timelineChanged = function () {
        orchestrator.play(0, this.selectedTimeline());
    };

    this.initialize = function () {
        resetControls();
        this.showControls = ko.observable(true);
        this.narrativeInfo = ko.observable(JSON.stringify(orchestrator._rinData, null, "\t"));
        this.currentTime(orchestrator.getCurrentLogicalTimeOffset());
        this.totalDuration(orchestrator && orchestrator.getNarrativeInfo() && orchestrator.getNarrativeInfo().totalDuration || 10);
        this.allScreenTimelines(getScreenplayIds(orchestrator._rinData.screenplays));
        this.selectedTimeline(orchestrator.currentScreenPlayId);
    };

    playerControl.seeked.subscribe(function () {
        self.selectedTimeline(orchestrator.currentScreenPlayId);
        self.totalDuration((orchestrator && orchestrator.getNarrativeInfo() && orchestrator.getNarrativeInfo().totalDuration) || 0);
    });
};

rin.internal.MailDataViewModel = function (orchestrator) {
    var newLine = "%0D%0A";
    var tabSpace = "%09";
    this.linkTitle = "Share over email";
    this.shareControlClass = "rin_MailShareButton";
    this.getDeepstate = function () {
        var deepStateUrl = rin.internal.getDeepState(orchestrator.getDeepState(), orchestrator.playerControl.narrativeUrl);
        var url = "mailto:?subject=Rich Interactive Narratives - {2}&body=Hey,{0}{1}Try this out - {1}{3}{0}".rinFormat(newLine, tabSpace, orchestrator.getNarrativeInfo().title, encodeURIComponent(deepStateUrl));
        window.open(url);
    }
};
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.XElement = function (xmlElement) {
    var elem = xmlElement;
    if (typeof xmlElement == "string") {
        elem = rin.internal.XmlHelper.parseXml(xmlElement).documentElement;
    }
    this.xmlElement = elem;
};

rin.internal.XElement.prototype = {
    xmlElement: null,
    element: function (childElementName) {
        var children = this.xmlElement.childNodes;
        for (var i = 0, len = children.length; i < len; i++)
            if (!childElementName || children[i].nodeName == childElementName) return new rin.internal.XElement(children[i]);
        return null;
    },
    elements: function (childElementName, elementOperation) {
        var out = [];
        var children = this.xmlElement.childNodes;
        for (var i = 0, len = children.length; i < len; i++)
            if (!childElementName || children[i].nodeName == childElementName) {
                var rinElement = new rin.internal.XElement(children[i]);
                out.push(rinElement);
                if (typeof elementOperation == "function") elementOperation(rinElement);
            }
        return out;
    },
    elementValue: function (childElementName, defaultValue) {
        var elem = this.element(childElementName);
        return elem ? elem.value() : defaultValue;
    },
    attributeValue: function (attributeName, defaultValue) {
        var attributes = this.xmlElement.attributes;
        for (var i = 0, len = attributes.length; i < len; i++)
            if (attributes[i].nodeName == attributeName) return attributes[i].value;
        return defaultValue;
    },
    value: function () {
        return this.xmlElement.text || this.xmlElement.textContent;
    }
};

rin.internal.XmlHelper = {
    parseXml: function (xmlString) {
        var xmlDoc;
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlString, "text/xml");
        }
        else // IE
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlString);
        }
        return xmlDoc;
    },
    loadXml: function (xmlFileUrl) {
        var xmlDoc, xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", xmlFileUrl, false);
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;
        return xmlDoc;
    }
};
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../contracts/IOrchestrator.js"/>
/// <reference path="../core/Common.js">
/// <reference path="../core/Orchestrator.js">

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.SelfTester = function (orchestrator) {
    "use strict";

    var self = this,
        timer = new rin.internal.Timer(),
        getNextInterval = function () {
            return rin.util.randInt(self.minimumTimeInterval, self.maximumTimeInterval);
        },
        narrativeDuration = 0,
        allScreenplays,
        numberOfScreenplays,
        lastDeepState = null,
        selfTestOptions = null,
        startTime = Date.now(),
        callback = function (isInDeepState) {
            if (!isInDeepState) orchestrator.playerControl.play();
        },
        initialize = function (options) {
            startTime = Date.now();
            self.minimumTimeInterval = self.minimumTimeInterval || 1;
            self.maximumTimeInterval = self.maximumTimeInterval || (orchestrator && orchestrator.getNarrativeInfo() && orchestrator.getNarrativeInfo().totalDuration) || 3;
            narrativeDuration = orchestrator.getNarrativeInfo().totalDuration;
            allScreenplays = orchestrator.getSegmentInfo().screenplays;
            numberOfScreenplays = Object.keys(allScreenplays).length;
            selfTestOptions = options;
        },
        logEvent = function (message) {
            self.logMessageEvent.publish("Time:" + ((Date.now() - startTime) / 1000  | 0)+ " " + message);
        },
        doOperation = function () {
            var opCode = Math.floor(rin.util.randInt(0, 8)),
                currrentTimeOffset = orchestrator.getCurrentLogicalTimeOffset(),
                esWithInteractionControls,
                nextOffset,
                nextScreenplay;
            switch (opCode) {
                case 0:
                case 1:
                case 2:
                    if (orchestrator.getPlayerState() === rin.contracts.playerState.playing) {
                        logEvent(">>> Self Tester issues a pause at " + currrentTimeOffset);
                        orchestrator.playerControl.pause();
                    } else if (orchestrator.getPlayerState() === rin.contracts.playerState.pausedForExplore) {
                        logEvent(">>> Self Tester issues a play at " + currrentTimeOffset);
                        orchestrator.playerControl.play();
                    }
                    break;
                case 3:
                    nextOffset = rin.util.rand(0, narrativeDuration);
                    logEvent(">>> Self Tester issues a pause to " + nextOffset);
                    orchestrator.playerControl.pause(nextOffset);
                    break;
                case 4:
                    nextOffset = rin.util.rand(0, narrativeDuration);
                    logEvent(">>> Self Tester issues a play to " + nextOffset);
                    orchestrator.playerControl.play(nextOffset);
                    break;
                case 5:
                    esWithInteractionControls = orchestrator.getCurrentESItems().firstOrDefault(function (item) {
                        return typeof item.experienceStream.getInteractionControls === 'function';
                    });
                    if (esWithInteractionControls) {
                        logEvent(">>> Self Tester starts interaction with " + esWithInteractionControls.experienceId);
                        orchestrator.startInteractionMode(esWithInteractionControls.experienceStream);
                        setTimeout(function () {
                            self.interactionEvent.publish();
                        }, 100);
                    }
                    break;
                case 6:
                    if (!lastDeepState) {
                        logEvent(">>> Self Tester retrieves deep state Url");
                        lastDeepState = orchestrator.playerControl.getDeepStateUrl();
                    } else {
                        logEvent(">>> Self Tester navigates to deepStateUrl with reload = " + selfTestOptions.deepstateReloadOption());
                        var deepstateUrl = orchestrator.playerControl.resolveDeepstateUrlFromAbsoluteUrl(lastDeepState);
                        if (selfTestOptions.deepstateReloadOption()) {
                            orchestrator.playerControl.unload();
                            orchestrator.playerControl.load(deepstateUrl, callback);
                        }
                        else {
                            orchestrator.seekUrl(deepstateUrl, callback);
                        }
                        lastDeepState = null;
                    }
                    break;
                case 7:
                    var nextScpId = rin.util.randInt(0, numberOfScreenplays) | 0; // (| 0) Strips the floating point part
                    nextScreenplay = Object.keys(allScreenplays)[nextScpId];
                    nextOffset = rin.util.rand(0, narrativeDuration);
                    logEvent(">>> Self Tester plays screenplay: " + nextScreenplay + " at offset:" + nextOffset);
                    narrativeDuration = orchestrator.esItemsManager._getScreenPlayInterpreter(nextScreenplay).getEndTime();
                    orchestrator.playerControl.play(nextOffset, nextScreenplay);
                    break;
            }
        };

    timer.tick = function () {
        doOperation();
        timer.intervalSeconds = getNextInterval();
    };

    this.logMessageEvent = new rin.contracts.Event();
    this.interactionEvent = new rin.contracts.Event();

    this.minimumTimeInterval = 0;
    this.maximumTimeInterval = 0;

    this.startSelfTest = function (options) {
        initialize(options);
        timer.intervalSeconds = getNextInterval();
        timer.start();
    };
    this.stopSelfTest = function () {
        timer.stop();
    };    
};
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/
window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

// Global class to help with debugging RIN player at run time. Includes a number of helper classes during debugging. Not needed at shipping.
rin.internal.RinDebugger = function (rinPlayer) {
    var self = this;
    this.player = rinPlayer;
    this.orchestrator = rinPlayer.orchestrator;
    this.getCurrentESItems = function () {
        return rinPlayer.orchestrator.getCurrentESItems()
            .where(function (esItem) { return esItem.providerId != "unknownOrSystem" && !esItem.experienceStream.isSystemES; })
    };

    this.getBufferingESs = function () {
        return rinPlayer.orchestrator.getCurrentESItems()
        .where(function (esItem) { return esItem.experienceStream.getState() == rin.contracts.experienceStreamState.buffering; });
    };

    this.getPreloaderBufferingESs = function () {
        return rinPlayer.orchestrator.esItemsManager.preloaderES._currentPreloadList
        .where(function (esItem) { return esItem.experienceStream.getState() == rin.contracts.experienceStreamState.buffering || esItem.experienceStream.getState() == rin.contracts.experienceStreamState.closed; });
    };

    this.getAllESItems = function () {
        return rinPlayer.orchestrator.esItemsManager.screenPlayInterpreter.getESItems();
    };

    this.getErrorESItems = function () {
        return rinDebug.getAllESItems().where(function (esItem) { return esItem.experienceStream.getState() == rin.contracts.experienceStreamState.error; });
    };

    this.getRinData = function () { return rinPlayer.orchestrator._rinData; };

    this.getRinDataJsonString = function () { return JSON.stringify(rinPlayer.orchestrator._rinData); }

    this.getCurrentScreenPlayInfo = function () {
        var info =
            {
                currentScreenPlayId: rinPlayer.orchestrator.currentScreenPlayId,
                defaultScreenPlayId: rinPlayer.orchestrator._rinData.defaultScreenplayId,
                currentScreenPlay: rinPlayer.orchestrator._rinData.screenplays[rinPlayer.orchestrator.currentScreenPlayId]
            };
        return info;
    };

    // Log buffering ESs on buffering.
    setInterval(function () {
        if (rinPlayer.orchestrator && rinPlayer.orchestrator.getPlayerState() == rin.contracts.playerState.pausedForBuffering) {
            var log = "Buffering ESs: ";
            self.getBufferingESs().foreach(function (es) { log += es.id + ", " });
            rin.internal.debug.write(log);
        }
    }, 1000);
}
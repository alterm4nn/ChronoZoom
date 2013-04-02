/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

using System;
using System.Diagnostics;
using Thinktecture.IdentityModel.Constants;

namespace Thinktecture.IdentityModel.Diagnostics
{
    /// <summary>
    /// Helper class for Tracing
    /// </summary>
    internal static class Tracing
    {
        [DebuggerStepThrough]
        public static void Start(string area)
        {
            TraceEvent(TraceEventType.Start, area, "Start");
        }

        [DebuggerStepThrough]
        public static void Stop(string area)
        {
            TraceEvent(TraceEventType.Stop, area, "Stop");
        }

        [DebuggerStepThrough]
        public static void Information(string area, string message)
        {
            TraceEvent(TraceEventType.Information, area, message);
        }

        [DebuggerStepThrough]
        public static void Warning(string area, string message)
        {
            TraceEvent(TraceEventType.Warning, area, message);
        }

        [DebuggerStepThrough]
        public static void Error(string area, string message)
        {
            TraceEvent(TraceEventType.Error, area, message);
        }

        [DebuggerStepThrough]
        public static void Verbose(string area, string message)
        {
            TraceEvent(TraceEventType.Verbose, area, message);
        }

        [DebuggerStepThrough]
        public static void TraceEvent(TraceEventType type, string area, string message)
        {
            TraceSource ts = new TraceSource(Internal.TraceSourceName);

            if (Trace.CorrelationManager.ActivityId == Guid.Empty)
            {
                if (type != TraceEventType.Verbose)
                {
                    Trace.CorrelationManager.ActivityId = Guid.NewGuid();
                }
            }

            ts.TraceEvent(type, 0, string.Format("{0}: {1}", area, message));
        }
    }
}
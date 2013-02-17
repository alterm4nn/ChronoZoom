// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.Diagnostics;
using Microsoft.AspNet.SignalR;

namespace OuterCurve
{
    /// <summary>
    /// TraceListener for sending trace messages from service using SignalR.
    /// </summary>
    public class SignalRTraceListener : TraceListener
    {
        private readonly IHubContext _traceLog;

        public SignalRTraceListener()
        {
            _traceLog = GlobalHost.ConnectionManager.GetHubContext<TraceLog>();
        }

        public override void TraceEvent(TraceEventCache eventCache, string source, TraceEventType eventType, int id)
        {
            _traceLog.Clients.All.traceEvent(source, eventType.ToString(), id);
        }

        public override void TraceEvent(TraceEventCache eventCache, string source, TraceEventType eventType, int id, string message)
        {
            _traceLog.Clients.All.traceEvent(source, eventType.ToString(), id, message);
        }

        // ReSharper disable MethodOverloadWithOptionalParameter
        public override void TraceEvent(TraceEventCache eventCache, string source, TraceEventType eventType, int id, string format, params object[] args)
        // ReSharper restore MethodOverloadWithOptionalParameter
        {
            // ReSharper disable ConditionIsAlwaysTrueOrFalse
            if (args == null)
            // ReSharper restore ConditionIsAlwaysTrueOrFalse
            // ReSharper disable HeuristicUnreachableCode
            {
                _traceLog.Clients.All.traceEvent(source, eventType.ToString(), id, format, args);
            }
            // ReSharper restore HeuristicUnreachableCode
            else
            {
                _traceLog.Clients.All.traceEvent(source, eventType.ToString(), id, string.Format(format, args));
            }
        }

        public override void Write(string message)
        {
        }

        public override void WriteLine(string message)
        {
            _traceLog.Clients.All.traceEvent(message);
        }
    }
}
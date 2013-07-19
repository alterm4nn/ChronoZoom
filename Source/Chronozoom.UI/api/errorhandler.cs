// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Configuration;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using System.ServiceModel.Web;
using System.Web;

namespace Chronozoom.UI
{
    [DataContract]
    public class ErrorMessage
    {
        public ErrorMessage(Exception error)
        {
            if (error == null)
                return;

            Message = error.Message;
            Stack = error.StackTrace;
            Exception = error.GetType().Name;
        }

        [DataMember(Name = "stacktrace")]
        public string Stack { get; set; }

        [DataMember(Name = "message")]
        public string Message { get; set; }

        [DataMember(Name = "exception")]
        public string Exception { get; set; }
    }

    public class ErrorHandler : IErrorHandler
    {
        private static readonly TraceSource Trace = new TraceSource("Service", SourceLevels.All) { Listeners = { Global.SignalRTraceListener } };

        public bool HandleError(Exception error)
        {
            if (error == null)
                return false;

            while (error != null)
            {
                Trace.TraceInformation("API Error - " + error.Message);
                error = error.InnerException;
            }

            return false;
        }

        public void ProvideFault(Exception error, MessageVersion version, ref Message fault)
        {
            if (error == null || version == null)
                return;

            fault = Message.CreateMessage(version, "", new ErrorMessage(error), new DataContractJsonSerializer(typeof(ErrorMessage)));
            var wbf = new WebBodyFormatMessageProperty(WebContentFormat.Json);
            fault.Properties.Add(WebBodyFormatMessageProperty.Name, wbf);

            var response = WebOperationContext.Current.OutgoingResponse;
            response.ContentType = "application/json";
            response.StatusCode = HttpStatusCode.InternalServerError; 
        }
    }

    public class ServiceErrorHandlerServiceBehavior : IServiceBehavior
    {
        public void AddBindingParameters(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, System.Collections.ObjectModel.Collection<ServiceEndpoint> endpoints, BindingParameterCollection bindingParameters)
        {
        }

        public void ApplyDispatchBehavior(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        {
            if (serviceDescription == null || serviceHostBase == null)
                return;

            foreach (ChannelDispatcher channelDispatcher in serviceHostBase.ChannelDispatchers)
            {
                channelDispatcher.ErrorHandlers.Add(new ErrorHandler());
            }
        }

        public void Validate(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        {
        }
    }

    public class ServiceErrorHandlerBehaviorExtension : BehaviorExtensionElement
    {
        public override Type BehaviorType
        {
            get { return typeof(ServiceErrorHandlerServiceBehavior); }
        }

        protected override object CreateBehavior()
        {
            return new ServiceErrorHandlerServiceBehavior();
        }
    }

    public class EndpointErrorHandlerHttpBehavior : WebHttpBehavior
    {
        public override void ApplyDispatchBehavior(ServiceEndpoint endpoint, EndpointDispatcher endpointDispatcher)
        {
            if (endpoint == null || endpointDispatcher == null)
                return;

            base.ApplyDispatchBehavior(endpoint, endpointDispatcher);

            endpointDispatcher.DispatchRuntime.Operations.Remove(endpointDispatcher.DispatchRuntime.UnhandledDispatchOperation);
            endpointDispatcher.DispatchRuntime.UnhandledDispatchOperation = new DispatchOperation(endpointDispatcher.DispatchRuntime, "*", "*", "*");
            endpointDispatcher.DispatchRuntime.UnhandledDispatchOperation.DeserializeRequest = false;
            endpointDispatcher.DispatchRuntime.UnhandledDispatchOperation.SerializeReply = false;
            endpointDispatcher.DispatchRuntime.UnhandledDispatchOperation.Invoker = new UnknownOperationInvoker();

        }
    }

    internal class UnknownOperationInvoker : IOperationInvoker
    {
        private static readonly TraceSource Trace = new TraceSource("Service", SourceLevels.All) { Listeners = { Global.SignalRTraceListener } };

        public object[] AllocateInputs()
        {
            return new object[1];
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Reliability", "CA2000:Dispose objects before losing scope")]
        public object Invoke(object instance, object[] inputs, out object[] outputs)
        {
            string unhandledOperation = "Unhandled Operation";
            Message fault = Message.CreateMessage(MessageVersion.None, unhandledOperation, new ErrorMessage(new InvalidOperationException(unhandledOperation)), new DataContractJsonSerializer(typeof(ErrorMessage)));
            Trace.TraceInformation("API Error - " + unhandledOperation);

            fault.Properties.Add(WebBodyFormatMessageProperty.Name, new WebBodyFormatMessageProperty(WebContentFormat.Json));

            var response = WebOperationContext.Current.OutgoingResponse;
            response.ContentType = "application/json";
            response.StatusCode = HttpStatusCode.InternalServerError;

            outputs = null;
            return fault;
        }

        public System.IAsyncResult InvokeBegin(object instance, object[] inputs, System.AsyncCallback callback, object state)
        {
            throw new System.NotImplementedException();
        }

        public object InvokeEnd(object instance, out object[] outputs, System.IAsyncResult result)
        {
            throw new System.NotImplementedException();
        }

        public bool IsSynchronous
        {
            get { return true; }
        }
    }

    public class EndpointErrorHandlerBehaviorExtension : BehaviorExtensionElement
    {
        public override Type BehaviorType
        {
            get { return typeof(EndpointErrorHandlerHttpBehavior); }
        }

        protected override object CreateBehavior()
        {
            return new EndpointErrorHandlerHttpBehavior();
        }
    }
}
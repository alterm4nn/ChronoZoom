using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Tests
{
    public class LoopBackHandler : DelegatingHandler
    {
        private readonly Func<HttpRequestMessage, HttpResponseMessage> _f;

        public LoopBackHandler(Func<HttpRequestMessage, HttpResponseMessage> f)
        {
            _f = f;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => _f(request));
        }
    }

}

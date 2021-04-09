using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using Twitr.Business;

namespace Twitr.Grpc
{
    public class _Type_Service : _Type_Grpc._Type_GrpcBase
    {
        private readonly ILogger<_Type_Service> logger;
        private readonly _Type_ target;

        public _Type_Service(ILogger<_Type_Service> logger, _Type_ target)
        {
            this.logger = logger;
            this.target = target;
        }

        /* #Method */
        public override async Task _Method_(_Request_ request, IServerStreamWriter<_Response_> responseStream, ServerCallContext context)
        {
            var result = target._Method_(/* #Parameter */_request_._Parameter_/* ,/ */);

            await responseStream.WriteAsync(result);
        }
        /* / */
    }
}

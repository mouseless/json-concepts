// using System.Threading.Tasks;
// using Grpc.Core;
// using Microsoft.Extensions.Logging;
// using Twitr.Business;

// namespace Twitr.Grpc
// {
//     public class FeedService : FeedGrpc.FeedGrpcBase
//     {
//         private readonly ILogger<FeedService> logger;
//         private readonly Feed feed;

//         public FeedService(ILogger<FeedService> logger, Feed feed)
//         {
//             this.logger = logger;
//             this.feed = feed;
//         }

//         public override async Task GetPosts(GetPostsRequest request, IServerStreamWriter<Post> responseStream, ServerCallContext context) =>
//             await responseStream.WriteAsync(new Post { });
//     }
// }

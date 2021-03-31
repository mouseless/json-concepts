using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;

namespace Twitr.Grpc
{
    public class Program
    {
        public static void Main(string[] args) => Host
            .CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder => webBuilder
                .ConfigureKestrel(options => options.ListenLocalhost(5000, o => o.Protocols = HttpProtocols.Http2))
                .UseStartup<Startup>()
            )
            .Build()
            .Run()
        ;
    }
}

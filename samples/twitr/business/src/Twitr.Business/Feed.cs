using System;
using System.Collections.Generic;
using System.Linq;

namespace Twitr.Business
{
    [Service]
    public class Feed
    {
        private readonly IRepository<Post> repository;

        public Feed(IRepository<Post> repository)
        {
            this.repository = repository;
        }

        public List<Post> GetPosts() => repository.All();
    }

    public class ServiceAttribute : Attribute
    {
    }
}

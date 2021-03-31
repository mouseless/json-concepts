using System.Collections.Generic;

namespace Twitr.Business
{
    public class Feed
    {
        private readonly IRepository<Post> repository;

        public Feed(IRepository<Post> repository)
        {
            this.repository = repository;
        }

        public List<Post> Get() => repository.All();

        public List<Post> GetByName(string name) => repository.All();
    }
}

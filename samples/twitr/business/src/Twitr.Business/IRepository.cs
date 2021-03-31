using System.Collections.Generic;

namespace Twitr.Business
{
    public interface IRepository<T>
    {
        List<T> All();
    }

    public class NullRepository<T> : IRepository<T>
    {
        public List<T> All() => new List<T>();
    }
}

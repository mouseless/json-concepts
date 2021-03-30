using System.Collections.Generic;

namespace Twitr.Business
{
    public interface IRepository<T>
    {
        List<T> All();
    }
}

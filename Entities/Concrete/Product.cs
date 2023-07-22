using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class Product : BaseEntity, IEntity
    {
        public string productName { get; set; }
        public int size { get; set; }
        public int productColorId { get; set; }
    }
}

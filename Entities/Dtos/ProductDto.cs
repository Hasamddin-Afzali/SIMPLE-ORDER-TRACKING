using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class ProductDto : IDto
    {
        public int productId { get; set; }
        public string productName { get; set; }
        public int size { get; set; }
        public string colorName { get; set; }
    }
}

using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class OrderDto : IDto
    {
        public int orderId { get; set; }
        public DateTime orderDate { get; set; }
        public int customerId { get; set; }
        public string productName { get; set; }
        public int size { get; set; }
        public string colorName { get; set; }
        public int Quantity { get; set; }
    }
}

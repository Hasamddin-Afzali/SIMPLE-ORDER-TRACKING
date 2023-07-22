
using System;
using System.Linq;
using Core.DataAccess.EntityFramework;
using Entities.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using DataAccess.Abstract;
using Entities.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Concrete.EntityFramework
{
    public class OrderRepository : EfEntityRepositoryBase<Order, ProjectDbContext>, IOrderRepository
    {
        public OrderRepository(ProjectDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<OrderDto>> GetOrderDtos()
        {
            var list = await (from p in Context.Orders
                              join product in Context.Products on p.ProductId equals product.Id
                              join pColor in Context.ProductColors on product.productColorId equals pColor.Id
                              join customer in Context.Users on p.CustomerId equals customer.UserId
                              join order in Context.Orders on p.Quantity equals order.Quantity
                              where p.isDeleted == false
                              select new OrderDto
                              {
                                  orderId = p.Id,
                                  Quantity = order.Quantity,
                                  colorName = pColor.colorName,
                                  customerId = customer.UserId,
                                  productName = product.productName,
                                  size = product.size,
                              }).ToListAsync();

            return list;
        }
    }
}

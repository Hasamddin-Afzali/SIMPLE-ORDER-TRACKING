
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
    public class ProductRepository : EfEntityRepositoryBase<Product, ProjectDbContext>, IProductRepository
    {
        public ProductRepository(ProjectDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<ProductDto>> GetProductDtos()
        {
            var list = await (from p in Context.Products
                              join pColor in Context.ProductColors on p.productColorId equals pColor.Id
                              where p.isDeleted == false
                              select new ProductDto
                              {
                                  productId = p.Id,
                                  colorName = pColor.colorName,
                                  productName = p.productName,
                                  size = p.size,
                              }).ToListAsync();

            return list;
        }
    }
}

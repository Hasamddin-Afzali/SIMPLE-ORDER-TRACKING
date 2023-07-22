
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
    public class StockRepository : EfEntityRepositoryBase<Stock, ProjectDbContext>, IStockRepository
    {
        public StockRepository(ProjectDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<StockDto>> GetStockDtos()
        {
            var list = await (from p in Context.Stocks
                              join product in Context.Products on p.ProductId equals product.Id
                              join pColor in Context.ProductColors on product.productColorId equals pColor.Id
                              where p.isDeleted == false
                              select new StockDto
                              {
                                  Id = p.Id,
                                  colorName = pColor.colorName,
                                  IsReadyForSale = p.IsReadyForSale,
                                  productName = product.productName,
                                  Quantity = p.Quantity,
                                  size = product.size
                              }).ToListAsync();

            return list;
        }
    }
}

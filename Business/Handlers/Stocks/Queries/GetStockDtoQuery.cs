
using Business.BusinessAspects;
using Core.Utilities.Results;
using Core.Aspects.Autofac.Performance;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Caching;
using Entities.Dtos;

namespace Business.Handlers.Stocks.Queries
{

    public class GetStockDtoQuery : IRequest<IDataResult<IEnumerable<StockDto>>>
    {
        public class GetStockDtoQueryHandler : IRequestHandler<GetStockDtoQuery, IDataResult<IEnumerable<StockDto>>>
        {
            private readonly IStockRepository _stockRepository;
            private readonly IMediator _mediator;

            public GetStockDtoQueryHandler(IStockRepository stockRepository, IMediator mediator)
            {
                _stockRepository = stockRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<StockDto>>> Handle(GetStockDtoQuery request, CancellationToken cancellationToken)
            {
                return new SuccessDataResult<IEnumerable<StockDto>>(await _stockRepository.GetStockDtos());
            }
        }
    }
}
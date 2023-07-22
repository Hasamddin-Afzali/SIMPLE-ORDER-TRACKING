
using Business.BusinessAspects;
using Core.Aspects.Autofac.Performance;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Caching;

namespace Business.Handlers.ProductColors.Queries
{

    public class GetProductColorsQuery : IRequest<IDataResult<IEnumerable<ProductColor>>>
    {
        public class GetProductColorsQueryHandler : IRequestHandler<GetProductColorsQuery, IDataResult<IEnumerable<ProductColor>>>
        {
            private readonly IProductColorRepository _productColorRepository;
            private readonly IMediator _mediator;

            public GetProductColorsQueryHandler(IProductColorRepository productColorRepository, IMediator mediator)
            {
                _productColorRepository = productColorRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<ProductColor>>> Handle(GetProductColorsQuery request, CancellationToken cancellationToken)
            {
                return new SuccessDataResult<IEnumerable<ProductColor>>(await _productColorRepository.GetListAsync());
            }
        }
    }
}
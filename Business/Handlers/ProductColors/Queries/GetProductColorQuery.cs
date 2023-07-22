
using Business.BusinessAspects;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;


namespace Business.Handlers.ProductColors.Queries
{
    public class GetProductColorQuery : IRequest<IDataResult<ProductColor>>
    {
        public int Id { get; set; }

        public class GetProductColorQueryHandler : IRequestHandler<GetProductColorQuery, IDataResult<ProductColor>>
        {
            private readonly IProductColorRepository _productColorRepository;
            private readonly IMediator _mediator;

            public GetProductColorQueryHandler(IProductColorRepository productColorRepository, IMediator mediator)
            {
                _productColorRepository = productColorRepository;
                _mediator = mediator;
            }
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<ProductColor>> Handle(GetProductColorQuery request, CancellationToken cancellationToken)
            {
                var productColor = await _productColorRepository.GetAsync(p => p.Id == request.Id);
                return new SuccessDataResult<ProductColor>(productColor);
            }
        }
    }
}

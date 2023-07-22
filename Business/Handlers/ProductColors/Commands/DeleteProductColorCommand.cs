
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;
using System.Threading;
using System.Threading.Tasks;


namespace Business.Handlers.ProductColors.Commands
{
    /// <summary>
    /// 
    /// </summary>
    public class DeleteProductColorCommand : IRequest<IResult>
    {
        public int Id { get; set; }

        public class DeleteProductColorCommandHandler : IRequestHandler<DeleteProductColorCommand, IResult>
        {
            private readonly IProductColorRepository _productColorRepository;
            private readonly IMediator _mediator;

            public DeleteProductColorCommandHandler(IProductColorRepository productColorRepository, IMediator mediator)
            {
                _productColorRepository = productColorRepository;
                _mediator = mediator;
            }

            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(DeleteProductColorCommand request, CancellationToken cancellationToken)
            {
                var productColorToDelete = _productColorRepository.Get(p => p.Id == request.Id);

                _productColorRepository.Delete(productColorToDelete);
                await _productColorRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Deleted);
            }
        }
    }
}


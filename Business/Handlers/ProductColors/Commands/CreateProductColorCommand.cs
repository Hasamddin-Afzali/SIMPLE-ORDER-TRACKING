
using Business.BusinessAspects;
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Business.Handlers.ProductColors.ValidationRules;

namespace Business.Handlers.ProductColors.Commands
{
    /// <summary>
    /// 
    /// </summary>
    public class CreateProductColorCommand : IRequest<IResult>
    {

        public int CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int LastUpdatedUserId { get; set; }
        public System.DateTime LastUpdatedDate { get; set; }
        public bool Status { get; set; }
        public bool isDeleted { get; set; }
        public string colorName { get; set; }


        public class CreateProductColorCommandHandler : IRequestHandler<CreateProductColorCommand, IResult>
        {
            private readonly IProductColorRepository _productColorRepository;
            private readonly IMediator _mediator;
            public CreateProductColorCommandHandler(IProductColorRepository productColorRepository, IMediator mediator)
            {
                _productColorRepository = productColorRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(CreateProductColorValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(CreateProductColorCommand request, CancellationToken cancellationToken)
            {
                var isThereProductColorRecord = _productColorRepository.Query().Any(u => u.colorName == request.colorName);

                if (isThereProductColorRecord == true)
                    return new ErrorResult(Messages.NameAlreadyExist);

                var addedProductColor = new ProductColor
                {
                    CreatedUserId = request.CreatedUserId,
                    CreatedDate = System.DateTime.Now,
                    LastUpdatedUserId = request.LastUpdatedUserId,
                    LastUpdatedDate = System.DateTime.Now,
                    Status = request.Status,
                    isDeleted = request.isDeleted,
                    colorName = request.colorName,

                };

                _productColorRepository.Add(addedProductColor);
                await _productColorRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Added);
            }
        }
    }
}

using Business.Constants;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Core.Aspects.Autofac.Validation;
using Business.Handlers.ProductColors.ValidationRules;


namespace Business.Handlers.ProductColors.Commands
{


    public class UpdateProductColorCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public int CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int LastUpdatedUserId { get; set; }
        public System.DateTime LastUpdatedDate { get; set; }
        public bool Status { get; set; }
        public bool isDeleted { get; set; }
        public string colorName { get; set; }

        public class UpdateProductColorCommandHandler : IRequestHandler<UpdateProductColorCommand, IResult>
        {
            private readonly IProductColorRepository _productColorRepository;
            private readonly IMediator _mediator;

            public UpdateProductColorCommandHandler(IProductColorRepository productColorRepository, IMediator mediator)
            {
                _productColorRepository = productColorRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(UpdateProductColorValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateProductColorCommand request, CancellationToken cancellationToken)
            {
                var isThereProductColorRecord = await _productColorRepository.GetAsync(u => u.Id == request.Id);


                isThereProductColorRecord.CreatedUserId = request.CreatedUserId;
                isThereProductColorRecord.CreatedDate = request.CreatedDate;
                isThereProductColorRecord.LastUpdatedUserId = request.LastUpdatedUserId;
                isThereProductColorRecord.LastUpdatedDate = request.LastUpdatedDate;
                isThereProductColorRecord.Status = request.Status;
                isThereProductColorRecord.isDeleted = request.isDeleted;
                isThereProductColorRecord.colorName = request.colorName;


                _productColorRepository.Update(isThereProductColorRecord);
                await _productColorRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}


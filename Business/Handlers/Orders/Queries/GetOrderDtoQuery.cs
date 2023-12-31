﻿
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

namespace Business.Handlers.Orders.Queries
{

    public class GetOrderDtoQuery : IRequest<IDataResult<IEnumerable<OrderDto>>>
    {
        public class GetOrderDtoQueryHandler : IRequestHandler<GetOrderDtoQuery, IDataResult<IEnumerable<OrderDto>>>
        {
            private readonly IOrderRepository _orderRepository;
            private readonly IMediator _mediator;

            public GetOrderDtoQueryHandler(IOrderRepository orderRepository, IMediator mediator)
            {
                _orderRepository = orderRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<OrderDto>>> Handle(GetOrderDtoQuery request, CancellationToken cancellationToken)
            {
                return new SuccessDataResult<IEnumerable<OrderDto>>(await _orderRepository.GetOrderDtos());
            }
        }
    }
}
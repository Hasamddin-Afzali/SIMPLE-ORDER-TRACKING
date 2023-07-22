
using Business.Handlers.ProductColors.Queries;
using DataAccess.Abstract;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static Business.Handlers.ProductColors.Queries.GetProductColorQuery;
using Entities.Concrete;
using static Business.Handlers.ProductColors.Queries.GetProductColorsQuery;
using static Business.Handlers.ProductColors.Commands.CreateProductColorCommand;
using Business.Handlers.ProductColors.Commands;
using Business.Constants;
using static Business.Handlers.ProductColors.Commands.UpdateProductColorCommand;
using static Business.Handlers.ProductColors.Commands.DeleteProductColorCommand;
using MediatR;
using System.Linq;
using FluentAssertions;


namespace Tests.Business.HandlersTest
{
    [TestFixture]
    public class ProductColorHandlerTests
    {
        Mock<IProductColorRepository> _productColorRepository;
        Mock<IMediator> _mediator;
        [SetUp]
        public void Setup()
        {
            _productColorRepository = new Mock<IProductColorRepository>();
            _mediator = new Mock<IMediator>();
        }

        [Test]
        public async Task ProductColor_GetQuery_Success()
        {
            //Arrange
            var query = new GetProductColorQuery();

            _productColorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<ProductColor, bool>>>())).ReturnsAsync(new ProductColor()
//propertyler buraya yazılacak
//{																		
//ProductColorId = 1,
//ProductColorName = "Test"
//}
);

            var handler = new GetProductColorQueryHandler(_productColorRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            //x.Data.ProductColorId.Should().Be(1);

        }

        [Test]
        public async Task ProductColor_GetQueries_Success()
        {
            //Arrange
            var query = new GetProductColorsQuery();

            _productColorRepository.Setup(x => x.GetListAsync(It.IsAny<Expression<Func<ProductColor, bool>>>()))
                        .ReturnsAsync(new List<ProductColor> { new ProductColor() { /*TODO:propertyler buraya yazılacak ProductColorId = 1, ProductColorName = "test"*/ } });

            var handler = new GetProductColorsQueryHandler(_productColorRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            ((List<ProductColor>)x.Data).Count.Should().BeGreaterThan(1);

        }

        [Test]
        public async Task ProductColor_CreateCommand_Success()
        {
            ProductColor rt = null;
            //Arrange
            var command = new CreateProductColorCommand();
            //propertyler buraya yazılacak
            //command.ProductColorName = "deneme";

            _productColorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<ProductColor, bool>>>()))
                        .ReturnsAsync(rt);

            _productColorRepository.Setup(x => x.Add(It.IsAny<ProductColor>())).Returns(new ProductColor());

            var handler = new CreateProductColorCommandHandler(_productColorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _productColorRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Added);
        }

        [Test]
        public async Task ProductColor_CreateCommand_NameAlreadyExist()
        {
            //Arrange
            var command = new CreateProductColorCommand();
            //propertyler buraya yazılacak 
            //command.ProductColorName = "test";

            _productColorRepository.Setup(x => x.Query())
                                           .Returns(new List<ProductColor> { new ProductColor() { /*TODO:propertyler buraya yazılacak ProductColorId = 1, ProductColorName = "test"*/ } }.AsQueryable());

            _productColorRepository.Setup(x => x.Add(It.IsAny<ProductColor>())).Returns(new ProductColor());

            var handler = new CreateProductColorCommandHandler(_productColorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            x.Success.Should().BeFalse();
            x.Message.Should().Be(Messages.NameAlreadyExist);
        }

        [Test]
        public async Task ProductColor_UpdateCommand_Success()
        {
            //Arrange
            var command = new UpdateProductColorCommand();
            //command.ProductColorName = "test";

            _productColorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<ProductColor, bool>>>()))
                        .ReturnsAsync(new ProductColor() { /*TODO:propertyler buraya yazılacak ProductColorId = 1, ProductColorName = "deneme"*/ });

            _productColorRepository.Setup(x => x.Update(It.IsAny<ProductColor>())).Returns(new ProductColor());

            var handler = new UpdateProductColorCommandHandler(_productColorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _productColorRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Updated);
        }

        [Test]
        public async Task ProductColor_DeleteCommand_Success()
        {
            //Arrange
            var command = new DeleteProductColorCommand();

            _productColorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<ProductColor, bool>>>()))
                        .ReturnsAsync(new ProductColor() { /*TODO:propertyler buraya yazılacak ProductColorId = 1, ProductColorName = "deneme"*/});

            _productColorRepository.Setup(x => x.Delete(It.IsAny<ProductColor>()));

            var handler = new DeleteProductColorCommandHandler(_productColorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _productColorRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Deleted);
        }
    }
}


﻿
using Business.Handlers.Products.Commands;
using FluentValidation;

namespace Business.Handlers.Products.ValidationRules
{

    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.size).NotEmpty();
            RuleFor(x => x.productColorId).NotEmpty();

        }
    }
    public class UpdateProductValidator : AbstractValidator<UpdateProductCommand>
    {
        public UpdateProductValidator()
        {
            RuleFor(x => x.size).NotEmpty();
            RuleFor(x => x.productColorId).NotEmpty();

        }
    }
}
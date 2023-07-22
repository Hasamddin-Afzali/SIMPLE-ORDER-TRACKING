
using Business.Handlers.ProductColors.Commands;
using FluentValidation;

namespace Business.Handlers.ProductColors.ValidationRules
{

    public class CreateProductColorValidator : AbstractValidator<CreateProductColorCommand>
    {
        public CreateProductColorValidator()
        {

        }
    }
    public class UpdateProductColorValidator : AbstractValidator<UpdateProductColorCommand>
    {
        public UpdateProductColorValidator()
        {

        }
    }
}
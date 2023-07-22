export class OrderDto{
    orderId : number;
    customerId: number;
    productName: string;
    size: number;
    colorName: string;
    quantity: number;
    orderDate: (Date | any);

}
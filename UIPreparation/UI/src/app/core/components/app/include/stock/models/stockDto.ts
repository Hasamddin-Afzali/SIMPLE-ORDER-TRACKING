export class StockDto{
    Id : number;
    productId : number;
    productName : string;
    size : number;
    colorName: string;
    isReadyForSale:boolean; 
    quantity?:number;   
}
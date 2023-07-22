import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/Alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { Stock } from './models/stock';
import { StockService } from './services/stock.service';
import { environment } from 'environments/environment';
import { StockDto } from './models/stockDto';
import { ProductDto } from '../product/models/productDto';
import { EnumSize } from '../product/models/size';

declare var jQuery: any;

@Component({
	selector: 'app-stock',
	templateUrl: './stock.component.html',
	styleUrls: ['./stock.component.scss']
})
export class StockComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['Id','productName','size', 'colorName','isReadyForSale','quantity', 'update','delete'];

	stockList:Stock[];
	stock:Stock=new Stock();

	stockAddForm: FormGroup;


	stockId:number;
	stockDtoList:StockDto[];
	productDtoList: ProductDto[];

	constructor(private stockService:StockService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        
		this.getProductDtoList();
    }

	ngOnInit() {
		this.authService.getCurrentUserId();
		this.createStockAddForm();
		this.getStockDtoList();	
		this.getProductDtoList();
	}
	getEnumSizeString(size: EnumSize): string {
		switch (size) {
		  case EnumSize.S:
			return 'Small';
		  case EnumSize.M:
			return 'Medium';
		  case EnumSize.L:
			return 'Large';
		case EnumSize.XL:
			return 'X-Large';
		  default:
			return '';
		}
	}

	getStockDtoList() {
		this.stockService.getStockDtoList().subscribe(data => {
			this.stockDtoList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}
	getProductDtoList() {
		this.stockService.getProductDtoList().subscribe(data => {
			this.productDtoList = data;
			//console.log(this.productDtoList);
			
			
		});
	}
	save(){

		if (this.stockAddForm.valid) {
			this.stock = Object.assign({}, this.stockAddForm.value)
			this.stock.createdUserId = this.authService.getCurrentUserId();
			this.stock.lastUpdatedUserId = this.authService.getCurrentUserId();
			this.stock.status = true;
			this.stock.isDeleted = false;
			if (this.stock.id == 0)
				this.addStock();
			else
				this.updateStock();
		}

	}

	addStock(){

		this.stockService.addStock(this.stock).subscribe(data => {
			this.getStockDtoList();
			this.stock = new Stock();
			jQuery('#stock').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.stockAddForm);

		})

	}

	updateStock(){

		this.stockService.updateStock(this.stock).subscribe(data => {

			var index=this.stockList.findIndex(x=>x.id==this.stock.id);
			this.stockList[index]=this.stock;
			this.dataSource = new MatTableDataSource(this.stockList);
            this.configDataTable();
			this.stock = new Stock();
			jQuery('#stock').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.stockAddForm);

		})

	}

	createStockAddForm() {
		this.stockAddForm = this.formBuilder.group({		
			id : [0],
			createdUserId : [0, Validators.required],
			//createdDate : [null, Validators.required],
			lastUpdatedUserId : [0, Validators.required],
			//lastUpdatedDate : [null, Validators.required],
			// status : [false, Validators.required],
			// isDeleted : [false, Validators.required],
			isReadyForSale : [false, Validators.required],
			quantity : [0, Validators.required],
			productId : [0, Validators.required]
		})
	}

	deleteStock(stockId:number){
		this.stockService.deleteStock(stockId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.stockList=this.stockList.filter(x=> x.id!=stockId);
			this.dataSource = new MatTableDataSource(this.stockList);
			this.configDataTable();
		})
	}

	getStockById(stockId:number){
		this.clearFormGroup(this.stockAddForm);
		this.stockService.getStockById(stockId).subscribe(data=>{
			this.stock=data;
			this.stockAddForm.patchValue(data);
		})
	}


	clearFormGroup(group: FormGroup) {

		group.markAsUntouched();
		group.reset();

		Object.keys(group.controls).forEach(key => {
			group.get(key).setErrors(null);
			if (key == 'id')
				group.get(key).setValue(0);
		});
	}

	checkClaim(claim:string):boolean{
		return this.authService.claimGuard(claim)
	}

	configDataTable(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

  }

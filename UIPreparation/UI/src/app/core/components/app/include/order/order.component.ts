import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/Alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { Order } from './models/order';
import { OrderService } from './services/order.service';
import { environment } from 'environments/environment';
import { ProductService } from '../product/services/product.service';
import { ProductDto } from '../product/models/productDto';
import { OrderDto } from './models/orderDto';
import { EnumSize } from '../product/models/size';

declare var jQuery: any;

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})
export class OrderComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['customerId','productName','size','colorName', 'quantity', 'update','delete'];

	orderList:Order[];
	order:Order=new Order();

	orderAddForm: FormGroup;


	orderId:number;
	productList: any;
	productDtoList: ProductDto[];
	orderDtoList: OrderDto[];

	constructor(private orderService:OrderService, 
		private lookupService:LookUpService,
		private alertifyService:AlertifyService,
		private formBuilder: FormBuilder, 
		private authService:AuthService,
		private ProductService: ProductService
		) { }

    ngAfterViewInit(): void {
        this.getOrderDtoList();
    }

	ngOnInit() {
		this.getProducts();
		this.createOrderAddForm();
		this.getOrderDtoList();
		this.getProductDtoList();
		this.createOrderAddForm();
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

	getProductDtoList() {
		this.ProductService.getProductDtoList().subscribe(data => {
			this.productDtoList = data;
			
			
		});
	}
	getOrderDtoList() {
		this.orderService.getOrderDtoList().subscribe(data => {
			this.orderDtoList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}
	getProducts() {
		this.ProductService.getProductList().subscribe((res) => {
			
		  this.productList = res;
		  console.log(this.productList);
		  if (res)
			console.log("ok")
		},
		  err =>
			console.log("faild")
		);
	  }
	// getOrderList() {
	// 	this.orderService.getOrderList().subscribe(data => {
	// 		this.orderList = data;
	// 		this.dataSource = new MatTableDataSource(data);
    //         this.configDataTable();
	// 	});
	// }

	save(){

		if (this.orderAddForm.valid) {
			this.order = Object.assign({}, this.orderAddForm.value)
			this.order.createdUserId = this.authService.getCurrentUserId();
			this.order.lastUpdatedUserId = this.authService.getCurrentUserId();
			this.order.customerId = this.authService.getCurrentUserId();
			this.order.status = true;
			this.order.isDeleted = false;
			if (this.order.id == 0)
				this.addOrder();
			else
				this.updateOrder();
		}

	}

	addOrder(){

		this.orderService.addOrder(this.order).subscribe(data => {
			this.getOrderDtoList();
			this.order = new Order();
			jQuery('#order').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.orderAddForm);

		})

	}

	updateOrder(){

		this.orderService.updateOrder(this.order).subscribe(data => {

			var index=this.orderList.findIndex(x=>x.id==this.order.id);
			this.orderList[index]=this.order;
			this.dataSource = new MatTableDataSource(this.orderList);
            this.configDataTable();
			this.order = new Order();
			jQuery('#order').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.orderAddForm);

		})

	}

	createOrderAddForm() {
		this.orderAddForm = this.formBuilder.group({		
			id : [0],
			createdUserId : [0, Validators.required],
			//createdDate : [null, Validators.required],
			lastUpdatedUserId : [0, Validators.required],
			//lastUpdatedDate : [null, Validators.required],
			//status : [false, Validators.required],
			//isDeleted : [false, Validators.required],
			customerId : [0, Validators.required],
			quantity : [0, Validators.required],
			productId : [0, Validators.required]
		})
	}

	deleteOrder(orderId:number){
		this.orderService.deleteOrder(orderId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.orderList=this.orderList.filter(x=> x.id!=orderId);
			this.dataSource = new MatTableDataSource(this.orderList);
			this.configDataTable();
		})
	}

	getOrderById(orderId:number){
		this.clearFormGroup(this.orderAddForm);
		this.orderService.getOrderById(orderId).subscribe(data=>{
			this.order=data;
			this.orderAddForm.patchValue(data);
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

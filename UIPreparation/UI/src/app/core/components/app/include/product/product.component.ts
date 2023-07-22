import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/Alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { environment } from 'environments/environment';
import { Product } from './models/product';
import { ProductService } from './services/product.service';
import { ProductColorComponent } from '../productColor/productColor.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProductDto } from './models/productDto';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { ProductColorService } from '../productColor/services/productcolor.service';
import { ProductColor } from '../productColor/models/productcolor';
import { EnumSize } from './models/size';

declare var jQuery: any;

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['productId','productName','size','colorName', 'update','delete'];

	productList:Product[];
	productDtoList:ProductDto[];
	product:Product=new Product();

	productAddForm: FormGroup;


	productId:number;

	colorList: ProductColor[];

	productSize = Object.keys(EnumSize).filter(key => isNaN(Number(EnumSize[key])))
    .map(key => ({ key, value: EnumSize[key] }));

	constructor(private productService:ProductService, 
		private lookupService:LookUpService,
		private alertifyService:AlertifyService,
		private formBuilder: FormBuilder, 
		private authService:AuthService,
		private dialog: MatDialog,
		private ProductColorService: ProductColorService,
		) { }

    ngAfterViewInit(): void {
        this.getProductDtoList();
		this.authService.getCurrentUserId();
    }

	ngOnInit() {
		console.log(this.authService.getCurrentUserId());
		this.createProductAddForm();
		this.getColor();
	}


	getProductDtoList() {
		this.productService.getProductDtoList().subscribe(data => {
			this.productDtoList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}
	getColor() {
		this.ProductColorService.getProductColorList().subscribe((res) => {
			
		  this.colorList = res;
		  console.log(this.colorList);
		  if (res)
			console.log("ok")
		},
		  err =>
			console.log("faild")
		);
	  }

	save(){

		if (this.productAddForm.valid) {
			this.product = Object.assign({}, this.productAddForm.value)
			this.product.createdUserId = this.authService.getCurrentUserId();
			this.product.lastUpdatedUserId = this.authService.getCurrentUserId();	 
			this.product.status = true;
			this.product.isDeleted = false;
			if (this.product.id == 0)
				this.addProduct();
			else
				this.updateProduct();
		}

	}

	addProduct(){

		this.productService.addProduct(this.product).subscribe(data => {
			this.getProductDtoList();
			this.product = new Product();
			jQuery('#product').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.productAddForm);

		})

	}

	updateProduct(){

		this.productService.updateProduct(this.product).subscribe(data => {

			var index=this.productList.findIndex(x=>x.id==this.product.id);
			this.productList[index]=this.product;
			this.dataSource = new MatTableDataSource(this.productList);
            this.configDataTable();
			this.product = new Product();
			jQuery('#product').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.productAddForm);

		})

	}

	createProductAddForm() {
		this.productAddForm = this.formBuilder.group({		
			id : [0],
			createdUserId : [0, Validators.required],
			lastUpdatedUserId : [0, Validators.required],
			productName : ["", Validators.required],
			size : [0, Validators.required],
			productColorId : [0, Validators.required]
		})
	}

	deleteProduct(productId:number){
		this.productService.deleteProduct(productId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.productList=this.productList.filter(x=> x.id!=productId);
			this.dataSource = new MatTableDataSource(this.productList);
			this.configDataTable();
		})
	}

	getProductById(productId:number){
		this.clearFormGroup(this.productAddForm);
		this.productService.getProductById(productId).subscribe(data=>{
			this.product=data;
			this.productAddForm.patchValue(data);
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

	openDialog(){
		this.dialog.open(ProductColorComponent,{
		   width: '900px'
	   });
   }

  }

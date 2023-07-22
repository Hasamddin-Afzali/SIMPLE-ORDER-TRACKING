import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/Alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { environment } from 'environments/environment';
import { ProductColor } from './models/productcolor';
import { ProductColorService } from './services/productcolor.service';

declare var jQuery: any;

@Component({
	selector: 'app-productColor',
	templateUrl: './productColor.component.html',
	styleUrls: ['./productColor.component.scss']
})
export class ProductColorComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','colorName', 'update','delete'];

	productColorList:ProductColor[];
	productColor:ProductColor=new ProductColor();

	productColorAddForm: FormGroup;


	productColorId:number;

	constructor(private productColorService:ProductColorService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getProductColorList();
    }

	ngOnInit() {
		this.authService.getCurrentUserId();
		this.createProductColorAddForm();
	}


	getProductColorList() {
		this.productColorService.getProductColorList().subscribe(data => {
			this.productColorList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.productColorAddForm.valid) {
			this.productColor = Object.assign({}, this.productColorAddForm.value)
			this.productColor.createdUserId = this.authService.getCurrentUserId();
			this.productColor.lastUpdatedUserId = this.authService.getCurrentUserId();
			this.productColor.status = true;
			this.productColor.isDeleted = false;
			if (this.productColor.id == 0)
				this.addProductColor();
			else
				this.updateProductColor();
		}

	}

	addProductColor(){

		this.productColorService.addProductColor(this.productColor).subscribe(data => {
			this.getProductColorList();
			this.productColor = new ProductColor();
			jQuery('#productcolor').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.productColorAddForm);

		})

	}

	updateProductColor(){

		this.productColorService.updateProductColor(this.productColor).subscribe(data => {

			var index=this.productColorList.findIndex(x=>x.id==this.productColor.id);
			this.productColorList[index]=this.productColor;
			this.dataSource = new MatTableDataSource(this.productColorList);
            this.configDataTable();
			this.productColor = new ProductColor();
			jQuery('#productcolor').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.productColorAddForm);

		})

	}

	createProductColorAddForm() {
		this.productColorAddForm = this.formBuilder.group({		
			id : [0],
			createdUserId : [0, Validators.required],
			// createdDate : [null, Validators.required],
			lastUpdatedUserId : [0, Validators.required],
			// lastUpdatedDate : [null, Validators.required],
			// status : [false, Validators.required],
			// isDeleted : [false, Validators.required],
			colorName : ["", Validators.required]
		})
	}

	deleteProductColor(productColorId:number){
		this.productColorService.deleteProductColor(productColorId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.productColorList=this.productColorList.filter(x=> x.id!=productColorId);
			this.dataSource = new MatTableDataSource(this.productColorList);
			this.configDataTable();
		})
	}

	getProductColorById(productColorId:number){
		this.clearFormGroup(this.productColorAddForm);
		this.productColorService.getProductColorById(productColorId).subscribe(data=>{
			this.productColor=data;
			this.productColorAddForm.patchValue(data);
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

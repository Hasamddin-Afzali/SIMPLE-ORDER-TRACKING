import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../admin/login/services/auth.service';


declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    claim:string;
}
export const ADMINROUTES: RouteInfo[] = [
  { path: '/user', title: 'Users', icon: 'how_to_reg', class: '', claim:"GetUsersQuery" },
  { path: '/group', title: 'Groups', icon:'groups', class: '',claim:"GetGroupsQuery" },
  { path: '/operationclaim', title: 'OperationClaim', icon:'local_police', class: '', claim:"GetOperationClaimsQuery"},
  { path: '/language', title: 'Languages', icon:'language', class: '', claim:"GetLanguagesQuery" },
  { path: '/translate', title: 'TranslateWords', icon: 'translate', class: '', claim: "GetTranslatesQuery" },
  { path: '/log', title: 'Logs', icon: 'update', class: '', claim: "GetLogDtoQuery" }
];

export const USERROUTES: RouteInfo[] = [ 
  { path: '/product', title: 'product', icon: 'list', class: '', claim: "GetProductsQuery" },
    //{ path: '/productcolor', title: 'productcolor', icon: 'brush', class: '', claim: "GetProductColorsQuery" },
    { path: '/stock', title: 'stock', icon: 'table', class: '', claim: "GetStocksQuery" },
    { path: '/order', title: 'order', icon: 'shopping_bag', class: '', claim: "GetOrdersQuery" }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  adminMenuItems: any[];
  userMenuItems: any[];

  constructor(private router:Router, private authService:AuthService,public translateService:TranslateService) {
    
  }

  ngOnInit() {
  
    this.adminMenuItems = ADMINROUTES.filter(menuItem => menuItem);
    this.userMenuItems = USERROUTES.filter(menuItem => menuItem);

    var lang=localStorage.getItem('lang') || 'tr-TR'
    this.translateService.use(lang);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  checkClaim(claim:string):boolean{
    return this.authService.claimGuard(claim)
  }
  ngOnDestroy() {
    if (!this.authService.loggedIn()) {
      this.authService.logOut();
      this.router.navigateByUrl("/login");
    }
  } 
 }


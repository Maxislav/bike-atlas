/**
 * Created by maxislav on 07.10.16.
 */
/**
 * Created by maxislav on 05.10.16.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import {TransactionResolver} from "./transaction.resolve";
@Component({
    //selector: 'router-outlet',
    //templateUrl: 'src/app/template/my-app.html'
    //template: '<div>My dashboard</div>'
    template: '<div></div>'
    
})
export class DashboardComponent {

    constructor( private router: Router) {
    }

    goToDetail(heroId: number): void {
        let link = ['/dashboard/', heroId];
        this.router.navigate(link);
    }
}
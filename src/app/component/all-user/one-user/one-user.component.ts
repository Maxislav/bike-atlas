import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';


@Component({
    selector: 'app-one-user',
    templateUrl: './one-user.component.html',
    styleUrls: ['./one-user.component.css']
})
export class OneUserComponent implements OnInit {

    id: number;

    constructor(private activateRoute: ActivatedRoute) {

        this.id = activateRoute.snapshot.params['id'];

        const sub = activateRoute
            .params
            .pipe(map( result => {
                return result['id']
            }))
            .subscribe((_id) => {
               this.id = _id
            })
    }

    ngOnInit() {
    }

}

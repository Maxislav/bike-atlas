import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FriendsService } from 'src/app/api/friends.service';
import { User } from 'src/app/service/main.user.service';


@Component({
    selector: 'app-one-user',
    templateUrl: './one-user.component.html',
    styleUrls: ['./one-user.component.css']
})
export class OneUserComponent implements OnInit {

    id: number;
    user: User;

    constructor(private activateRoute: ActivatedRoute, private  friendsService: FriendsService) {

        this.id = activateRoute.snapshot.params['id'];


        const sub = activateRoute
            .params
            .pipe(map(result => {
                return result['id'];
            }))
            .subscribe((_id) => {
                this.id = _id;
                friendsService.requestUserById(this.id)
                    .then((data) => {
                        this.user = data.user;
                    })
                    .catch(err => {
                        console.error(err)
                    })

            });
    }

    ngOnInit() {
    }

}

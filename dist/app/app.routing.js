"use strict";
var router_1 = require('@angular/router');
var heroes_component_1 = require('./heroes.component');
var auth_component_1 = require("./component/auth-component/auth.component");
var map_component_1 = require("./map.component");
var registration_component_1 = require("./component/registration/registration.component");
var device_component_1 = require("./component/device/device.component");
var auth_service_1 = require("./service/auth.service");
var profile_component_1 = require("./component/profile/profile.component");
var journal_component_1 = require("./component/journal-component/journal.component");
var friends_component_1 = require("./component/friends-component/friends-component");
var appRouters = [
    {
        path: '',
        redirectTo: 'auth/map',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: auth_component_1.AuthComponent,
        resolve: {
            transactions: auth_service_1.AuthService
        },
        children: [
            {
                path: ''
            },
            {
                path: 'map',
                component: map_component_1.MapComponent,
                children: [
                    {
                        path: ''
                    },
                    {
                        path: 'registration',
                        component: registration_component_1.RegistrationComponent
                    },
                    {
                        path: 'device',
                        component: device_component_1.DeviceComponent
                    },
                    {
                        path: 'profile',
                        component: profile_component_1.ProfileComponent
                    },
                    {
                        path: 'journal',
                        component: journal_component_1.JournalComponent
                    },
                    {
                        path: 'friends',
                        component: friends_component_1.FriendsComponent
                    }
                ]
            }
        ]
    },
    {
        path: 'heroes',
        component: heroes_component_1.HeroesComponent
    },
];
exports.routing = router_1.RouterModule.forRoot(appRouters);
//# sourceMappingURL=app.routing.js.map
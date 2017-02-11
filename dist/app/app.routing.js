"use strict";
const router_1 = require("@angular/router");
const heroes_component_1 = require("./heroes.component");
const auth_component_1 = require("./component/auth-component/auth.component");
const map_component_1 = require("./map.component");
const registration_component_1 = require("./component/registration/registration.component");
const device_component_1 = require("./component/device/device.component");
const auth_service_1 = require("./service/auth.service");
const profile_component_1 = require("./component/profile/profile.component");
const journal_component_1 = require("./component/journal-component/journal.component");
const friends_component_1 = require("./component/friends-component/friends-component");
const private_area_1 = require("./component/private-area/private-area");
const no_found_component_1 = require("./no-found.component");
const all_user_component_1 = require("./component/all-user/all-user.component");
const strava_component_1 = require("./component/strava-component/strava-component");
const appRouters = [
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
                        component: journal_component_1.JournalComponent,
                        resolve: {
                            L: journal_component_1.LeafletResolver
                        },
                    },
                    {
                        path: 'friends',
                        component: friends_component_1.FriendsComponent,
                        children: [
                            {
                                path: '',
                            },
                            {
                                path: 'all',
                                component: all_user_component_1.AllUserComponent
                            }
                        ]
                    },
                    {
                        path: 'privatearea',
                        component: private_area_1.PrivateArea,
                    },
                    {
                        path: 'strava-invite',
                        component: strava_component_1.StravaComponent
                    },
                    {
                        path: 'strava-invite/:token',
                        component: strava_component_1.StravaComponent
                    },
                ]
            }
        ]
    },
    {
        path: '404',
        component: no_found_component_1.NoFoundComponent
    },
    {
        path: '**',
        redirectTo: '404',
    },
    {
        path: 'heroes',
        component: heroes_component_1.HeroesComponent
    },
];
exports.routing = router_1.RouterModule.forRoot(appRouters, { useHash: true });
//# sourceMappingURL=app.routing.js.map
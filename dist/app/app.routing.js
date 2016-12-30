"use strict";
var router_1 = require('@angular/router');
var heroes_component_1 = require('./heroes.component');
var auth_component_1 = require("./component/auth-component/auth.component");
var map_component_1 = require("./map.component");
var registration_component_1 = require("./component/registration/registration.component");
var device_component_1 = require("./component/device/device.component");
var appRouters = [
    {
        path: '',
        redirectTo: 'auth/map',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: auth_component_1.AuthComponent,
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
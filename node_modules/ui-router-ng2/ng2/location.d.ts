/** @module ng2 */ /** */
import { PlatformLocation, LocationStrategy } from "@angular/common";
export declare class UIRouterLocation {
    locationStrategy: LocationStrategy;
    platformLocation: PlatformLocation;
    isHashBang: boolean;
    hashPrefix: string;
    constructor(locationStrategy: LocationStrategy, platformLocation: PlatformLocation);
    init(): void;
}

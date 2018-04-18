"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const animations_1 = require("@angular/animations");
const testAnimation = animations_1.trigger('ngIfAnimation', [
    animations_1.transition('void => *', [
        animations_1.style({ opacity: 0 }),
        animations_1.animate(100, animations_1.style({ opacity: 1 }))
        /*query('*', style({ opacity: 0, background: 'blue' }), {optional: true}),
        query('*', stagger('300ms', [
            animate('0.8s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
                style({opacity: 1, transform: 'translateY(0)', offset: 1.0}),
            ]))]), {optional: true}),*/
    ]),
    animations_1.transition('* => void', [
        animations_1.animate(100, animations_1.style({ opacity: 0 })) // the new state of the transition(after transiton it removes)
    ])
    /*transition('* => void', [
        query('*', style({ opacity: 1, background: 'red' }), {optional: true}),
        query('*', stagger('300ms', [
            animate('0.8s ease-in', keyframes([
                style({opacity: 1, transform: 'translateY(0)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
                style({opacity: 0, transform: 'translateY(-75%)', offset: 1.0}),
            ]))]), {optional: true}),
    ])*/
]);
exports.fadeAnimation = animations_1.trigger('ngIfAnimation', [
    animations_1.transition('void => *', [
        animations_1.style({ opacity: 0 }),
        animations_1.animate(100, animations_1.style({ opacity: 1 }))
    ]),
    animations_1.transition('* => void', [
        animations_1.animate(100, animations_1.style({ opacity: 0 })) // the new state of the transition(after transiton it removes)
    ])
]);
//# sourceMappingURL=animation.js.map
import { animate, style, transition, trigger } from '@angular/animations';

export const popupItemAnimation =
    trigger('popupItemAnimation', [
        // route 'enter' transition
        transition(':enter', [
            style({ opacity: 0,  transform: 'translateY(-20px)' }),
            animate(100, style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
            style({ opacity: 1 }),
            animate(100, style({ opacity: 0, transform: 'translateY(-20px)' }))
        ]),
    ]);


export const popupMaskInAnimation =
    trigger('popupMaskInAnimation', [
        // route 'enter' transition
        transition(':enter', [
            style({ opacity: 0 }),
            animate(100, style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({ opacity: 1 }),
            animate(100, style({ opacity: 0 }))
        ]),
    ]);
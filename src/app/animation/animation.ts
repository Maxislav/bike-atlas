import { trigger, style, transition, animate, keyframes, query, stagger, group, state, animateChild } from '@angular/animations';


const testAnimation = trigger('ngIfAnimation', [
    transition('void => *', [
        style({opacity:0}), //style only for transition transition (after transiton it removes)
        animate(100, style({opacity:1}))
        /*query('*', style({ opacity: 0, background: 'blue' }), {optional: true}),
        query('*', stagger('300ms', [
            animate('0.8s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
                style({opacity: 1, transform: 'translateY(0)', offset: 1.0}),
            ]))]), {optional: true}),*/
    ]),
    transition('* => void', [
        animate(100, style({opacity:0})) // the new state of the transition(after transiton it removes)
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
])

export const ngIfAnimation = trigger('ngIfAnimation', [
    transition('void => *', [
        style({opacity:0, transform: 'translateY(-20px)'}), //style only for transition transition (after transiton it removes)
        animate(100, style({opacity:1, transform: 'translateY(0)'}))
    ]),
    transition('* => void', [
        animate(100, style({opacity:0})) // the new state of the transition(after transiton it removes)
    ])
])

export const fadeInAnimation =
    trigger('fadeInAnimation', [
        // route 'enter' transition
        transition(':enter', [
            style({ opacity: 0 }),
            animate('1s', style({ opacity: 1 }))
        ]),
    ]);
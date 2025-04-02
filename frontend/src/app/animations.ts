import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [ // Applica l'animazione a tutte le transizioni di pagina
    style({ opacity: 0 }),
    animate('800ms ease-in-out', style({ opacity: 1 }))
  ])
]);
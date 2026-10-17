/**
 * SAV-SCC — Ponto de Entrada Principal de Scripts
 */

import { initNavigation } from './navigation.js';
import { initContactForm } from './contact-form.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initFinancialCycle } from './financial-cycle.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initContactForm();
  initScrollAnimations();
  initFinancialCycle();
});


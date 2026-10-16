/**
 * SAV-SCC — Ponto de Entrada Principal de Scripts
 */

import { initNavigation } from './navigation.js';
import { initContactForm } from './contact-form.js';
import { initScrollAnimations } from './scroll-animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initContactForm();
  initScrollAnimations();
});

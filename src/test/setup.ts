import '@testing-library/jest-dom/vitest';

// jsdom no implementa la captura de puntero, que Radix usa en gestos como el de
// descartar un aviso con el dedo. Los tests que miden la captura la sustituyen.
for (const method of ['hasPointerCapture', 'setPointerCapture', 'releasePointerCapture'] as const) {
  if (!(method in HTMLElement.prototype)) {
    Object.defineProperty(HTMLElement.prototype, method, { value: () => false, writable: true, configurable: true });
  }
}

require('@testing-library/jest-dom');
/** @type {import('@testing-library/jest-dom')} */ 

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 

if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
      onchange: null,
      media: '',
    };
  };
} 
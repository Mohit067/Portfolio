// Replaces next/dist/build/polyfills/polyfill-module. Every feature it patches
// (Array#at, Object.hasOwn, String#trimStart, ...) ships natively in all browsers
// Next 16 supports, so shipping the guards only costs bytes ("Legacy JavaScript").

// Pointer helpers for play functions. Bind listeners to the stage element,
// not window or document.body, so these events reach the component.
//
// movePointer(target, x, y): pointerenter and pointermove at a local offset.
// dragPointer(target, deltaX): pointerdown, three moves, a hold, pointerup,
// one frame apart so sketches that read the pointer per frame see each step.
export { movePointer } from '../../motion-examples/pointer/playSupport';
export { dragPointer } from '../../motion-examples/infinite-menu/playSupport';

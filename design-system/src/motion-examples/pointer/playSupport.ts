export function movePointer(target: Element, localX: number, localY: number) {
  const rect = target.getBoundingClientRect();
  const clientX = rect.left + localX;
  const clientY = rect.top + localY;
  const init: PointerEventInit = {
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'mouse',
  };
  target.dispatchEvent(new PointerEvent('pointerenter', init));
  target.dispatchEvent(new PointerEvent('pointermove', init));
  window.dispatchEvent(new PointerEvent('pointermove', init));
  window.dispatchEvent(
    new MouseEvent('mousemove', { clientX, clientY, bubbles: true }),
  );
}

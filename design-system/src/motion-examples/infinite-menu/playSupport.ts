function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

// Drag the pointer across the target. The arcball reads the pointer once per
// animation frame, so each event waits for a frame. The pointer stays down for
// `holdFrames` frames after the last move so the eased drag reaches the end.
export async function dragPointer(
  target: Element,
  deltaX: number,
  steps = 3,
  holdFrames = 12,
): Promise<void> {
  const rect = target.getBoundingClientRect();
  const startX = rect.left + rect.width / 2 - deltaX / 2;
  const clientY = rect.top + rect.height / 2;
  const init = (clientX: number, buttons: number): PointerEventInit => ({
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
    buttons,
  });

  target.dispatchEvent(new PointerEvent('pointerdown', init(startX, 1)));
  await nextFrame();
  for (let step = 1; step <= steps; step += 1) {
    const x = startX + (deltaX * step) / steps;
    target.dispatchEvent(new PointerEvent('pointermove', init(x, 1)));
    await nextFrame();
  }
  for (let frame = 0; frame < holdFrames; frame += 1) {
    await nextFrame();
  }
  target.dispatchEvent(new PointerEvent('pointerup', init(startX + deltaX, 0)));
}

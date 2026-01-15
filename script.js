const floatingBox = document.getElementById("floatingBox");
const dragHandle = document.getElementById("dragHandle");

let currentPosition = { x: 0, y: 0 };
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const clampPosition = (x, y) => {
  const boxBounds = floatingBox.getBoundingClientRect();
  const maxX = Math.max(window.innerWidth - boxBounds.width, 0);
  const maxY = Math.max(window.innerHeight - boxBounds.height, 0);

  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  };
};

const setPosition = (x, y) => {
  const { x: clampedX, y: clampedY } = clampPosition(x, y);
  currentPosition = { x: clampedX, y: clampedY };
  floatingBox.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
};

const centerPosition = () => {
  const boxBounds = floatingBox.getBoundingClientRect();
  const centeredX = (window.innerWidth - boxBounds.width) / 2;
  const centeredY = (window.innerHeight - boxBounds.height) / 2;
  setPosition(centeredX, centeredY);
};

const startDrag = (event) => {
  isDragging = true;
  const boxRect = floatingBox.getBoundingClientRect();
  dragOffset = {
    x: event.clientX - boxRect.left,
    y: event.clientY - boxRect.top,
  };
};

const onDrag = (event) => {
  if (!isDragging) {
    return;
  }
  const newX = event.clientX - dragOffset.x;
  const newY = event.clientY - dragOffset.y;
  setPosition(newX, newY);
};

const stopDrag = () => {
  isDragging = false;
};

dragHandle.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  dragHandle.setPointerCapture(event.pointerId);
  startDrag(event);
});

dragHandle.addEventListener("pointermove", onDrag);

dragHandle.addEventListener("pointerup", (event) => {
  dragHandle.releasePointerCapture(event.pointerId);
  stopDrag();
});

dragHandle.addEventListener("pointerleave", stopDrag);

dragHandle.addEventListener("pointercancel", stopDrag);

window.addEventListener("resize", () => {
  const { x, y } = clampPosition(currentPosition.x, currentPosition.y);
  setPosition(x, y);
});

centerPosition();

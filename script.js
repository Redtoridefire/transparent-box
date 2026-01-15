const floatingBox = document.getElementById("floatingBox");
const dragHandle = document.getElementById("dragHandle");
const opacityRange = document.getElementById("opacityRange");
const opacityValue = document.getElementById("opacityValue");
const widthRange = document.getElementById("widthRange");
const widthValue = document.getElementById("widthValue");
const heightRange = document.getElementById("heightRange");
const heightValue = document.getElementById("heightValue");
const resetButton = document.getElementById("resetBox");
const apiKeyInput = document.getElementById("apiKeyInput");
const modelSelect = document.getElementById("modelSelect");
const frameToggle = document.getElementById("frameToggle");
const promptInput = document.getElementById("promptInput");
const responseOutput = document.getElementById("responseOutput");
const sendButton = document.getElementById("sendButton");
const statusText = document.getElementById("statusText");

const defaultPosition = { x: 80, y: 120 };
let currentPosition = { ...defaultPosition };

let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let conversation = [];

const updateOpacity = (value) => {
  const clamped = Math.min(Math.max(parseFloat(value), 0.1), 1);
  floatingBox.style.background = `rgba(255, 255, 255, ${clamped})`;
  opacityValue.textContent = clamped.toFixed(2);
};

const updateBoxSize = () => {
  const width = parseInt(widthRange.value, 10);
  const height = parseInt(heightRange.value, 10);
  floatingBox.style.width = `${width}px`;
  floatingBox.style.height = `${height}px`;
  widthValue.textContent = `${width}px`;
  heightValue.textContent = `${height}px`;
};

const clampPosition = (x, y) => {
  const stage = floatingBox.parentElement;
  const bounds = stage.getBoundingClientRect();
  const boxBounds = floatingBox.getBoundingClientRect();

  const minX = 0;
  const minY = 0;
  const maxX = bounds.width - boxBounds.width;
  const maxY = bounds.height - boxBounds.height;

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
};

const setPosition = (x, y) => {
  const { x: clampedX, y: clampedY } = clampPosition(x, y);
  currentPosition = { x: clampedX, y: clampedY };
  floatingBox.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
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
  const stageRect = floatingBox.parentElement.getBoundingClientRect();
  const newX = event.clientX - stageRect.left - dragOffset.x;
  const newY = event.clientY - stageRect.top - dragOffset.y;
  setPosition(newX, newY);
};

const stopDrag = () => {
  isDragging = false;
};

const resetPosition = () => {
  setPosition(defaultPosition.x, defaultPosition.y);
};

const setStatus = (message) => {
  statusText.textContent = message;
};

const appendResponse = (content) => {
  responseOutput.textContent = content;
};

const sendToChatGPT = async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    setStatus("Add your API key to continue.");
    apiKeyInput.focus();
    return;
  }

  if (!prompt) {
    setStatus("Type a prompt to send.");
    promptInput.focus();
    return;
  }

  sendButton.disabled = true;
  setStatus("Sending...");

  conversation = [...conversation, { role: "user", content: prompt }];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelSelect.value,
        messages: conversation,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      setStatus("Request failed.");
      appendResponse(`Error: ${errorText}`);
      return;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "No response returned.";

    conversation = [...conversation, { role: "assistant", content: reply }];
    appendResponse(reply);
    setStatus("Received response.");
  } catch (error) {
    setStatus("Network error.");
    appendResponse(`Error: ${error.message}`);
  } finally {
    sendButton.disabled = false;
  }
};

const initializeFrameToggle = async () => {
  if (!window.electronAPI) {
    frameToggle.disabled = true;
    return;
  }

  const isFrameless = await window.electronAPI.getFrameState();
  frameToggle.checked = isFrameless;
};

opacityRange.addEventListener("input", (event) => updateOpacity(event.target.value));
widthRange.addEventListener("input", updateBoxSize);
heightRange.addEventListener("input", updateBoxSize);
resetButton.addEventListener("click", resetPosition);
sendButton.addEventListener("click", sendToChatGPT);

frameToggle.addEventListener("change", async () => {
  if (!window.electronAPI) {
    return;
  }
  frameToggle.checked = await window.electronAPI.toggleFrame();
});

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

updateOpacity(opacityRange.value);
updateBoxSize();
resetPosition();
initializeFrameToggle();

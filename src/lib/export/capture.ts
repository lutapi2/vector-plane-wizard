/** Capture a WebGL canvas to a PNG download. Requires preserveDrawingBuffer:true on the renderer. */
export const captureCanvas = (canvas: HTMLCanvasElement | null, name = "vectorlab-escena.png") => {
  if (!canvas) return;
  try {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error("No se pudo capturar la escena:", e);
  }
};

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// Collect the app's CSS custom properties that use color functions html2canvas
// cannot parse (Tailwind v4 theme tokens are oklch) and build an override rule
// so the cloned document resolves them to plain hex colors.
function buildVarOverrideCss(): string {
  const cs = getComputedStyle(document.documentElement);
  const decls: string[] = [];
  for (const prop of cs) {
    if (!prop.startsWith("--")) continue;
    const v = cs.getPropertyValue(prop);
    if (v && (v.includes("oklch") || v.includes("oklab") || v.includes("color-mix"))) {
      decls.push(`${prop}: ${prop.includes("foreground") ? "#0F172A" : "#E2E8F0"} !important;`);
    }
  }
  return decls.length ? `:root, :host { ${decls.join(" ")} }` : "";
}

export async function exportNodeToPdf(node: HTMLElement, fileName: string) {
  const overrideCss = buildVarOverrideCss();
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: node.offsetWidth,
    windowHeight: node.offsetHeight,
    onclone: (doc) => {
      if (overrideCss) {
        const style = doc.createElement("style");
        style.textContent = overrideCss;
        doc.head.appendChild(style);
      }
    },
  });
  const img = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(img, "JPEG", 0, 0, w, h, undefined, "FAST");
  pdf.save(fileName);
}

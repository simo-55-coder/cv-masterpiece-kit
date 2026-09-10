import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// html2canvas cannot parse oklch()/color-mix() that Tailwind v4 injects via
// base styles (notably the universal border-color rule). Force safe hex values
// on every captured element before rendering.
function sanitizeColors(root: HTMLElement) {
  // Neutralize inherited CSS custom properties (Tailwind v4 theme tokens are
  // oklch) so html2canvas never has to parse them while cloning styles.
  // Apply on the captured node itself: html2canvas clones this subtree, so
  // overrides on ancestors would be lost in the clone.
  const host = root;
  const hostCs = getComputedStyle(host);
  for (const prop of hostCs) {
    if (!prop.startsWith("--")) continue;
    const v = hostCs.getPropertyValue(prop);
    if (v && (v.includes("oklch") || v.includes("oklab") || v.includes("color-mix"))) {
      host.style.setProperty(prop, prop.includes("foreground") ? "#0F172A" : "#E2E8F0");
    }
  }
  const all = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  const props: Array<[string, string]> = [
    ["color", "#0F172A"],
    ["background-color", "#FFFFFF"],
    ["border-top-color", "#E2E8F0"],
    ["border-right-color", "#E2E8F0"],
    ["border-bottom-color", "#E2E8F0"],
    ["border-left-color", "#E2E8F0"],
    ["outline-color", "#E2E8F0"],
  ];
  for (const el of all) {
    const cs = getComputedStyle(el);
    for (const [prop, fallback] of props) {
      const v = cs.getPropertyValue(prop);
      if (v && (v.includes("oklch") || v.includes("color-mix") || v.includes("oklab"))) {
        el.style.setProperty(prop, fallback);
      }
    }
  }
}

export async function exportNodeToPdf(node: HTMLElement, fileName: string) {
  sanitizeColors(node);
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: node.offsetWidth,
    windowHeight: node.offsetHeight,
  });
  const img = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(img, "JPEG", 0, 0, w, h, undefined, "FAST");
  pdf.save(fileName);
}

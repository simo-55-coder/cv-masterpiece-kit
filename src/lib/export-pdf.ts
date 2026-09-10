import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportNodeToPdf(node: HTMLElement, fileName: string) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: node.offsetWidth,
    windowHeight: node.offsetHeight,
    // The Tailwind v4 stylesheet uses oklch() colors that html2canvas cannot
    // parse. The CV templates are fully inline-styled, so drop app stylesheets
    // from the clone (keeping web font links) for a reliable capture.
    onclone: (doc) => {
      doc
        .querySelectorAll<HTMLElement>('style, link[rel="stylesheet"]')
        .forEach((el) => {
          const href = el.getAttribute("href") ?? "";
          if (el.tagName === "STYLE" || !href.includes("fonts.g")) el.remove();
        });
    },
  });
  const img = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(img, "JPEG", 0, 0, w, h, undefined, "FAST");
  pdf.save(fileName);
}

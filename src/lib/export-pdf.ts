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
  });
  const img = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(img, "JPEG", 0, 0, w, h, undefined, "FAST");
  pdf.save(fileName);
}

declare module 'jspdf' {
  export default class jsPDF {
    constructor(orientation?: string, unit?: string, format?: string);
    
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
    };
    
    setFillColor(r: number, g: number, b: number): void;
    setTextColor(r: number, g: number, b: number): void;
    setFontSize(size: number): void;
    setFont(family: string, style?: string): void;
    
    rect(x: number, y: number, width: number, height: number, style?: string): void;
    text(text: string | string[], x: number, y: number): void;
    splitTextToSize(text: string, maxWidth: number): string[];
    addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): void;
    
    save(filename: string): void;
  }
}
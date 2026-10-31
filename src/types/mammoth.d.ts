declare module 'mammoth' {
  export interface MammothOptions {
    styleMap?: string | string[];
    includeDefaultStyleMap?: boolean;
  }
  export interface ConversionResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer } | { buffer: Buffer }, options?: MammothOptions): Promise<ConversionResult>;
  export function extractRawText(input: { arrayBuffer: ArrayBuffer } | { buffer: Buffer }): Promise<ConversionResult>;
}

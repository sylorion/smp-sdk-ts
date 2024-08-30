
export class ErrorHandler {
  static handleError(error: any, context: string) {
    console.error(`[${context}]`, error);
    // Handle errors based on context if needed
  }
}


class APIResponse {
    constructor(statusCode, data, message) {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message || (statusCode < 400 ? "Success" : "Error");
      this.success = statusCode < 400;
    }
  }
  
  export { APIResponse };
  
// Api response Template 

class ApiResponse {
    constructor(stausCode, message = "Success", data) {
        this.stausCode,
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; 
    }
}

class ApiError extends Error {
    constructor(
        statusCode, message = "Something went wrong",
        error = [],
        statck = ""
        
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}



export default ApiError;

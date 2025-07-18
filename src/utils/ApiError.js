class ApiError extends Error {
    constructor(
        statusCode, message = "Something went wrong",
        errors = [],
        stack = ""

    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.message = message;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            this.captureStackTrace(this, this.constructor);
        }
    }
}


export default ApiError;

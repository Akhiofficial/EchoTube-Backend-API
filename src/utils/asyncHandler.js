const asynchandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => 
            next(err))
    }
}



export default asynchandler;
//  export {asynchandler}; another way to export 


//  this is try catch method for async handler

// const asynchandler = (fn) => async (err,req,res,next) => {
//     try {
//         await fn(req,res,next)
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

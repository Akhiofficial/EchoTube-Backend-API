// creating controllers 
import  asyncHandler  from '../utils/asyncHandler.js'


// route 
const registerUser = asyncHandler (async (req,res)=> {
    res.status(200).json({
        message: "ok"
    })
})


// export {registerUser}
export default registerUser 
import jwt from "jsonwebtoken";
export const authenticate = (req,res,next) => {
    
    //get token from headers
    const authToken = req.headers.authorization
    
    //chk if token is exists
    if(!authToken || !authToken.startsWith('Bearer')){
        return res.status(401).json({success:false,message:"No token, authorization denied"})
    }
    try {
        const token = authToken.split(' ')[1];
        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        if(error.name==='TokenExpiredError'){
           return res.status(401).json({message:"Token expires"})
        }
        return res.status(401).json({success:false,message:"Invalid Token"})
    }
}
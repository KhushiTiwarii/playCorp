import Employee from "../model/EmployeeSchema.js";
import Admin from "../model/AdminSchema.js";
import Judge from "../model/JudgeSchema.js";

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = user=>{
    //how to make secret key in env 
    //on terminal write -> node
    //on entering write -> crypto.randomBytes(256).toString('base64')
    return jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET_KEY,{
        expiresIn:'30d',
    })
    
}

export const register = async (req, res) => {
    const { email, password, role} = req.body;
  
    try {
      let user = null;
      if (role === 'employee') {
        user = await Employee.findOne({ email });
      } else if (role === 'admin') {
        user = await Admin.findOne({ email });
      } else if (role === 'judge') {
        user = await Judge.findOne({ email });
      } 

      // Check if user exists
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      if (role === 'employee') {
        user = new Employee({
          email,
          password: hashPassword,
          role,
        });
      } else if (role === 'admin') {
        user = new Admin({
          email,
          password: hashPassword,
          role
        });
      } else if (role === 'judge') {
        user = new Judge({
          email,
          password: hashPassword,
          role
        });
      } 
  
      await user.save();
  
      res.status(200).json({ success: true, message: 'User successfully created' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error, Try again' });
    }
  };
  

export const login = async(req,res) => {
    
    const {email} = req.body;
    try {
        let user = null

        const employee = await Employee.findOne({email})
        const judge = await Judge.findOne({email})
        const admin = await Admin.findOne({email})

        if(employee){
            user=employee
        }
        if(judge){
            user=judge
        }
        if(admin){
            user=admin
        }
        //chk if user exists or not
        if(!user){
            return res.status(404).json({message:"User not found"}); 
        }
        //if user found chk if provided password matches the hashedpassword
        const isPasswordMatch = await bcrypt.compare(req.body.password,user.password)
        
        if(!isPasswordMatch){
            return res.status(400).json({status:false,message:"Invalid Credentials"})
        }
        //if password matches we will generate authentication token
        const token = generateToken(user);

        const {password,role,...rest} = user._doc

        res.status(200).json({status:true,message:"Successfully loggedIn", token, data:{...rest}, role})
    } catch (error) {
        res.status(500).json({status:false,message:"Failed to login"})
    }
}
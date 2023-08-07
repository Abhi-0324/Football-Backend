import { comparePassword } from '../../helpers/encrypt.js';
import user from '../../models/user.js';


const loginUser = async(req,res) => {
    try {
        const {email, password} = req.body;

        if(!email)  return res.status(400).send({success: false, message: 'Email must be present'});
        if(!password) return res.status(400).send({success: false, message: 'Password is required'});

        const User = await user.findOne({email});
        if(!User){
            return res.status(404).send({
                success: false,
                message: 'User not found' 
            })
        }

        const doesMatch = await comparePassword(password,User.password)
        
        if(!doesMatch){
            return res.status(402).send({
                success: false,
                message: 'Invalid credentials'
            })
        }


        //jwt code here


        return res.status(200).send({
            succes: true,
            message: 'Login successfull'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export default loginUser
import { hashPassword } from "../../helpers/encrypt.js";
import user from "../../models/user.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    //check for required fields
    if (!name)
      return res
        .status(400)
        .send({ success: false, message: "Name is required" });
    if (!email)
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    if (!password)
      return res
        .status(400)
        .send({ success: false, message: "Password is required" });

    const userExists = await user.findOne({email})
    if(userExists){
      return res.status(400).send({
        success: false,
        message: 'Email is already registered'
      })
    }

    const hashedPassword = await hashPassword(password);
    const newUser = user.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export default registerUser;

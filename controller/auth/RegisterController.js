import bcrypt from "bcrypt";
import User from "../../models/user.js";
import JwtService from "../../Services/jwtServices.js";
import CustomErrorHandler from "../../Services/CustomErrorHandler.js";

class RegisterController {
  static async register(req, res, next) {
    const { name, email, password, gender, user_image, date_of_birth } =
      req.body;
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(CustomErrorHandler.alreadyExist("Email already exists"));
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // prepare the model
      const user = new User({
        name,
        email,
        password: hashedPassword,
        gender,
        user_image,
        date_of_birth,
      });
      const result = await user.save();
      // generate Token
      const token = JwtService.sign({ _id: result._id, role: result.role });

      // cookie
      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httyOnly: true,
      });

      // res.status(201).json({ user: result, isAuth: true });
      res.status(201).json({ message: "ok" });
    } catch (error) {
      return next(error);
    }
  }
}
export default RegisterController;

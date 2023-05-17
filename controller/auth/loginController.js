// CHECKLIST
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import JwtService from "../../Services/jwtServices.js";
import { loginSchema } from "../../validators/validators.js";
class LoginController {
  static async login(req, res, next) {
    // validate the request
    try {
      const value = await loginSchema.validateAsync(req.body);
    } catch (error) {
      return next(error);
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({ message: "userName or password Not Match" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(401)
          .json({ message: "userName or password Not Match" });
      }
      // generate Token
      const token = JwtService.sign({ _id: user._id, role: user.role });

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httyOnly: true,
      });

      res.status(201).json({ user: user, isAuth: true });
    } catch (error) {
      console.log(error);
    }
  }

  static logout(req, res) {
    res.clearCookie("token");
    res.status(201).json({ user: null, isAuth: false });
  }
}
export default LoginController;

import AuthService from "../services/authService.js";

const login = (req, res, next) => {
  try {
    const authData = AuthService.login(req.body || {});

    return res.status(200).json({
      success: true,
      message: "Autenticacao realizada com sucesso.",
      data: authData
    });
  } catch (error) {
    return next(error);
  }
};

const AuthController = {
  login
};

export default AuthController;

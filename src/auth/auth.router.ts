import { Router } from 'express';
import { isValid } from './middlewares/isValid';
import { authController } from './auth.controller';
import { GoogleLoginCodeQuery } from './dtos/inputs/google_login_code.query';
import { LoginBody } from './dtos/inputs/login.body';
import { SignupBody } from './dtos/inputs/signup.body';

export const authRouter = Router();

// 회원가입
authRouter.post('/signup', isValid(LoginBody), authController.signup);

// 로그인
authRouter.post('/login', isValid(SignupBody), authController.login);

// 구글 회원가입
authRouter.get('/signup/google', authController.googleSignup);

authRouter.get(
  '/signup/google/redirect',
  isValid(GoogleLoginCodeQuery),
  authController.googleSignupRedirect,
);

// 구글 로그인
authRouter.get('/login/google', authController.googleLogin);

authRouter.get(
  '/login/google/redirect',
  isValid(GoogleLoginCodeQuery),
  authController.googleLoginRedirect,
);

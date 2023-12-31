import {NextFunction, Response} from 'express';
import {AppError, AuthRequest} from '../../core/types';
import {ErrorMessages} from '../../core/enums/error_messages';
import {HttpStatus} from '../../core/enums/http_status';
import {ACCESS_TOKEN_COOKIE_NAME} from '../../config/constants';
import {verifyAccessToken} from '../../utils/token';

export function mustAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const accessToken = req.signedCookies[ACCESS_TOKEN_COOKIE_NAME];

    // TODO: signedCookies는 미들웨어를 거쳐서 온 것이므로 쿠키를 조작한 경우에는 false가 나온다.
    // 쿠키를 임의로 조작한 경우 쪼까냄
    if (accessToken === false) {
        return next(
            AppError.new({
                message: ErrorMessages.INVALID_TOKEN,
                status: HttpStatus.UNAUTHORIZED,
            }),
        );
    }
    try {
        req.userId = verifyAccessToken(accessToken);
        next();
    } catch (e) {
        next(e);
    }
}

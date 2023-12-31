import {redisClient} from "../config/redis";
import {REDIS_BLACKLIST_PREFIX} from "../config/constants";

async function isBlackListed(accessToken: string) {
    const key = REDIS_BLACKLIST_PREFIX + accessToken;
    return (await redisClient.get(key)) !== null;
}

// async function addToBlackList(accessToken: string, exp: number) {
//     const key = REDIS_BLACKLIST_PREFIX + accessToken;
//     await redisClient.setEx(REDIS_BLACKLIST_PREFIX, exp, '');
// }
//
// async function addRefreshToken(accessToken: string, exp: number) {
//     await redisClient.setEx(REDIS_REFRESH_TOKEN_PREFIX, exp, '');
// }
//
//
// async function setAccessToken(
//     userId: number,
//     accessToken: string,
//     exp: number,
// ) {
//     await Redis.accessToken.setEx(
//         userId.toString(),
//         exp,
//         accessToken,
//     );
// }
//
// async function getRefreshToken(userId: number) {
//     const refreshToken = await Redis.refreshToken.get(userId.toString());
//
//     if (refreshToken === null) {
//
//     }
// }
//
// async function setRefreshToken(userId: number, refreshToken: string) {
//     const key = REDIS_REFRESH_TOKEN_PREFIX + userId;
//
//     await Redis.refreshToken.setEx(
//         key,
//         REFRESH_TOKEN_MAX_AGE,
//         refreshToken,
//     );
//
//     if (refreshToken === null) {
//
//     }
// }
//
// async function updateRefreshToken(userId: number) {
//     const refreshToken = await Redis.refreshToken.get(userId.toString());
//     if (refreshToken === null) return;
//
//     await Redis.refreshToken.set(userId.toString(), refreshToken, 'EX', 60 * 60 * 24 * 7);
// }
//
// async function deleteRefreshToken(userId: number) {
//     await Redis.refreshToken.del(userId.toString());
// }
//
// export default {}
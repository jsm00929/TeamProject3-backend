import moviesService from '../services/movies.service';
import {AuthRequestWith, OptionalAuthRequestWith, RequestWith} from '../../core/types';
import {MovieIdParams} from '../dtos/inputs/get_movie_detail.params';
import {AppResult} from '../../core/types/app_result';
import {MoviesPaginationQuery} from '../dtos/inputs/movies_pagination.query';
import {handle} from "../../core/handle";
import moviesLikeService from "../services/movies.like.service";
import moviesFavoriteService from "../services/movies.favorite.service";
import moviesHistoryService from "../services/movies.history.service";
import {PaginationQuery} from "../../core/dtos/inputs";
import {Router} from "express";
import {ToggleMovieLikeBody} from "../dtos/inputs/toggle_movie_like.body";
import {ToggleFavoriteMovieBody} from "../dtos/inputs/toggle_favorite_movie.body";

export const moviesRouter = Router();
/**
 * @description
 * 영화 페이지네이션
 */
moviesRouter.get(
    '/',
    handle({
        queryCls: MoviesPaginationQuery,
        controller: movies,
    }),
);

async function movies(req: RequestWith<MoviesPaginationQuery>) {
    const q = req.unwrap();
    const movies = await moviesService.movies(q);

    return AppResult.new({
        body: movies,
    })
}


/**
 * @description
 * 현재 로그인 된 사용자가 최근 본 영화
 */
moviesRouter.get('/histories',
    handle({
        authLevel: 'must',
        queryCls: PaginationQuery,
        controller: histories,
    }));

async function histories(req: AuthRequestWith<PaginationQuery>) {
    const {userId} = req;
    const q = req.unwrap();

    const movies =
        await moviesHistoryService.histories({userId}, q);

    return AppResult.new({body: movies});
}


/**
 * @description
 * 현재 로그인 된 사용자가 like 한 영화
 */
moviesRouter.get('/likes',
    handle({
        authLevel: 'must',
        queryCls: PaginationQuery,
        controller: likes,
    }));

async function likes(req: AuthRequestWith<PaginationQuery>) {
    const {userId} = req;
    const q = req.unwrap();

    const movies =
        await moviesLikeService.likeMovies({userId}, q);

    return AppResult.new({body: movies});
}


/**
 * @description
 * 현재 로그인 된 사용자가 like 한 영화
 */
moviesRouter.get('/favorites',
    handle({
        authLevel: 'must',
        queryCls: PaginationQuery,
        controller: favorites,
    }));

async function favorites(req: AuthRequestWith<PaginationQuery>) {
    const {userId} = req;
    const q = req.unwrap();

    const movies =
        await moviesFavoriteService.favoriteMovies({userId}, q);

    return AppResult.new({body: movies});
}


/**
 * @description
 * 영화 상세 정보 조회
 * 로그인 된 상태로 조회 시, Movie History 자동 추가
 */
moviesRouter.get(
    '/:movieId/detail',
    handle({
        authLevel: 'optional',
        paramsCls: MovieIdParams,
        controller: detail,
    }),
);


async function detail(req: OptionalAuthRequestWith<never, MovieIdParams>) {
    const {userId} = req;
    const {movieId} = req.unwrapParams();
    const movieDetail = await moviesService.movieDetail({userId, movieId});

    return AppResult.new({body: movieDetail});
}


/**
 * @description
 * 영화 좋아요 등록
 */
moviesRouter.post('/:movieId/like',
    handle({
        authLevel: 'must',
        paramsCls: MovieIdParams,
        bodyCls: ToggleMovieLikeBody,
        controller: toggleMovieLike,
    }));

async function toggleMovieLike(req: AuthRequestWith<ToggleMovieLikeBody, MovieIdParams>) {
    const userId = req.userId;
    const {movieId} = req.unwrapParams();

    const body = req.unwrap();

    await moviesLikeService.toggleMovieLike({userId, movieId}, body);

    return AppResult.default();
}


/**
 * @description
 * 영화 즐겨찾기 등록
 */
moviesRouter.post('/:movieId/favorite',
    handle({
        authLevel: 'must',
        paramsCls: MovieIdParams,
        bodyCls: ToggleFavoriteMovieBody,
        controller: toggleFavorite,
    }));

async function toggleFavorite(req: AuthRequestWith<ToggleFavoriteMovieBody, MovieIdParams>) {
    const userId = req.userId;
    const {movieId} = req.unwrapParams();
    const body = req.unwrap();

    await moviesFavoriteService.toggleFavorite({userId, movieId}, body);

    return AppResult.default();
}


/**
 * @description
 * 영화 즐겨찾기 삭제
 */
moviesRouter.delete('/:movieId/favorite',
    handle({
        authLevel: 'must',
        paramsCls: MovieIdParams,
        controller: deleteFavorite,
    }));


async function deleteFavorite(req: AuthRequestWith<never, MovieIdParams>) {
    const userId = req.userId;
    const {movieId} = req.unwrapParams();

    await moviesFavoriteService.deleteFavorite({userId, movieId});

    return AppResult.default();
}

/**
 * @description
 * 영화 기록 삭제
 */
moviesRouter.delete('/:movieId/histories',
    handle({
        authLevel: 'must',
        paramsCls: MovieIdParams,
        controller: deleteHistory,
    }));


async function deleteHistory(req: AuthRequestWith<never, MovieIdParams>) {
    const userId = req.userId;
    const {movieId} = req.unwrapParams();

    await moviesHistoryService.deleteByUserIdAndMovieId({userId, movieId});

    return AppResult.default();
}

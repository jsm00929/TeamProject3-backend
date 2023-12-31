/**
 * Movie Reviews
 */
import {AuthRequestWith, RequestWith} from "../../core/types";
import {CreateMovieReviewBody} from "../../reviews/dtos/create_movie_review.body";
import {MovieIdParams} from "../dtos/inputs/get_movie_detail.params";
import reviewsService from "../../reviews/reviews.service";
import {AppResult} from "../../core/types/app_result";
import {HttpStatus} from "../../core/constants";
import {EditMovieReviewBody} from "../../reviews/dtos/edit_review.body";
import {ReviewIdParams} from "../../reviews/dtos/review_id.params";
import {Router} from "express";
import {handle} from "../../core/handle";
import {PaginationQuery} from "../../core/dtos/inputs";


export const moviesReviewsRouter = Router();


/**
 * @description
 * 특정 영화에(id로 조회) 작성한 리뷰 조회하기
 */
moviesReviewsRouter.get(
    '/:movieId/reviews',
    handle({
        queryCls: PaginationQuery,
        paramsCls: MovieIdParams,
        controller: reviews,
    }),
);

async function reviews(
    req: RequestWith<PaginationQuery, MovieIdParams>,
) {
    const {movieId} = req.unwrapParams();
    const p = req.unwrap();

    const reviews = await reviewsService.reviewsByMovieId({movieId}, p);

    return AppResult.new({body: reviews});
}

/**
 * @description
 * 특정 영화에 대한 리뷰 작성하기
 */
moviesReviewsRouter.post(
    '/:movieId/reviews',
    handle({
        authLevel: 'must',
        bodyCls: CreateMovieReviewBody,
        paramsCls: MovieIdParams,
        controller: write,
    }),
);

async function write(
    req: AuthRequestWith<CreateMovieReviewBody, MovieIdParams>,
) {
    const {userId} = req;
    const {movieId} = req.unwrapParams();
    const body = req.unwrap();

    const reviewId = await reviewsService.write(
        {
            userId,
            movieId,
        },
        body,
    );

    return AppResult.new({
        body: {reviewId},
        status: HttpStatus.CREATED,
    });
}

/**
 * @description
 * 특정 영화 리뷰 수정하기
 */
moviesReviewsRouter.patch(
    '/reviews/:reviewId',
    handle({
        authLevel: 'must',
        bodyCls: EditMovieReviewBody,
        paramsCls: ReviewIdParams,
        controller: editReview,
    }),
);

async function editReview(
    req: AuthRequestWith<EditMovieReviewBody, ReviewIdParams>,
) {
    const userId = req.userId;
    const editReviewInput = req.unwrap();
    const {reviewId} = req.unwrapParams();

    await reviewsService.edit({userId, reviewId}, editReviewInput);
}


/**
 * @description
 * 특정 영화 리뷰 삭제하기
 */
moviesReviewsRouter.delete(
    '/reviews/:reviewId',
    handle({
        authLevel: 'must',
        paramsCls: ReviewIdParams,
        controller: removeReview,
    }),
)

async function removeReview(req: AuthRequestWith<never, ReviewIdParams>) {
    const {userId} = req;
    const {reviewId} = req.unwrapParams();
    console.log(reviewId)

    await reviewsService.remove({userId, reviewId});
}

/**
 * @description
 * 영화 상세 정보 조회
 * 로그인 된 상태로 조회 시, Movie History 자동 추가
 */
moviesReviewsRouter.get(
    '/:movieId/reviews/:reviewId',
    handle({
        paramsCls: MovieIdParams,
        controller: detail,
    }),
);

async function detail(req: RequestWith<never, ReviewIdParams>) {
    const {reviewId} = req.unwrapParams();
    const reviewDetail = await reviewsService.reviewDetail({reviewId});

    return AppResult.new({body: reviewDetail});
}

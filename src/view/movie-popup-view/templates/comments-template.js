import createNewCommentFormTemplate from './new-comment-form-template';
import createCommentsTitleTemplate from './comments-title-template';
import createCommentsListTemplate from './comments-list-template';

const createCommentsTemplate = (
  movie,
  comments,
  comment,
  isLoading,
  deletingCommentId,
  isCommentFormShaking,
  shakingCommentId,
  isCommentSubmitting,
) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      ${createCommentsTitleTemplate(movie.comments?.length ?? 0)}

      ${createCommentsListTemplate(isLoading, comments, deletingCommentId, shakingCommentId)}

      ${createNewCommentFormTemplate(comment, isCommentFormShaking, isCommentSubmitting)}
    </section>
  </div>`
);

export default createCommentsTemplate;

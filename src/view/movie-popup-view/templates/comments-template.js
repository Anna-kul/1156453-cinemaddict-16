import createNewCommentFormTemplate from './new-comment-form-template';
import createCommentsTitleTemplate from './comments-title-template';
import createCommentsListTemplate from './comments-list-template';

const createCommentsTemplate = (
  movie,
  comments,
  comment,
  isLoading,
  isCommentDeleting,
  isCommentFormShaking,
  shakingCommentId,
) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      ${createCommentsTitleTemplate(comments?.length ?? 0)}

      ${createCommentsListTemplate(isLoading, comments, isCommentDeleting, shakingCommentId)}

      ${createNewCommentFormTemplate(comment, isCommentFormShaking)}
    </section>
  </div>`
);

export default createCommentsTemplate;

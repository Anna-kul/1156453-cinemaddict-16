import createCommentTemplate from './comment-template';

const createCommentsListTemplate = (isLoading, comments, isCommentDeleting, shakingCommentId) => {
  if (isLoading) {
    return 'Loading...';
  }

  if (comments === null) {
    return '';
  }

  return (
    `<ul class="film-details__comments-list">
      ${comments.reduce((html, currentComment) => html + createCommentTemplate(currentComment, isCommentDeleting, currentComment.id === shakingCommentId), '')}
    </ul>`
  );
};

export default createCommentsListTemplate;

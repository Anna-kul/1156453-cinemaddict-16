import createCommentTemplate from './comment-template';

const createCommentsListTemplate = (isLoading, comments, deletingCommentId, shakingCommentId) => {
  if (isLoading) {
    return 'Loading...';
  }

  if (comments === null) {
    return '';
  }

  return (
    `<ul class="film-details__comments-list">
      ${comments.reduce((html, currentComment) => html + createCommentTemplate(currentComment, currentComment.id === deletingCommentId, currentComment.id === shakingCommentId), '')}
    </ul>`
  );
};

export default createCommentsListTemplate;

const createCommentsTitleTemplate = (commentsAmount) => {
  let title = 'Comments';

  title = commentsAmount > 0 ? `Comments: ${commentsAmount}` : 'No comments';

  return (
    `<h3 class="film-details__comments-title">
       ${title}
    </h3>`
  );
};

export default createCommentsTitleTemplate;

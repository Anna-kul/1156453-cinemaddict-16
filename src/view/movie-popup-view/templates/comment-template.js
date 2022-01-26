const createCommentTemplate = (comment) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.commentText}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.commentAutor}</span>
        <span class="film-details__comment-day">${comment.commentDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
);

export default createCommentTemplate;

import createCommentTemplate from './comment-template';
import createNewCommentFormTemplate from './new-comment-form-template';

const createCommentsTemplate = (movie, comment) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">
       ${movie.comments.length > 0
    ? `Comments <span class="film-details__comments-count">${movie.comments.length}</span>`
    : 'No comments'
  }
      </h3>

      <ul class="film-details__comments-list">
        ${movie.comments.reduce((html, currentComment) => html+createCommentTemplate(currentComment), '')}
      </ul>

      ${createNewCommentFormTemplate(comment)}
    </section>
  </div>`
);

export default createCommentsTemplate;

import AbstractModel, {ChangeType} from './abstract-model';

class CommentsModelError extends Error {}

const COMMENT_DATA_FIELDS = [
  'comment',
  'emotion',
  'date',
];

export default class CommentsModel extends AbstractModel {
  #apiService = null;

  _data = {}

  constructor(apiService) {
    super();

    this.#apiService = apiService;
  }

  get comments() {
    return Object.values(this._data);
  }

  set comments(comments) {
    this._data = comments.reduce((map, comment) => {
      map[comment.id] = comment;

      return map;
    }, {});

    this._notifyObservers(ChangeType.MAJOR);
  }

  async getMovieComments(movieId) {
    const movieComments = await this.#apiService.getMovieComments(movieId);

    this._data = this.#adaptCommentsToApp(movieComments);

    this._notifyObservers(ChangeType.MAJOR);
  }

  async addComment(movieId, commentData) {
    this.#validateCommentData(commentData);

    const {comments} = await this.#apiService.addComment(movieId, commentData);

    this._data = this.#adaptCommentsToApp(comments);

    this._notifyObservers(ChangeType.MAJOR);
  }

  async deleteComment(commentId) {
    await this.#apiService.deleteComment(commentId);

    delete this._data[commentId];

    this._notifyObservers(ChangeType.MAJOR);
  }

  #adaptCommentToApp = (comment) => ({
    ...comment,
    emoji: comment.emotion,
    text: comment.comment,
    date: new Date(comment.date),
  })

  #adaptCommentsToApp = (comments) => comments.reduce((map, comment) => {
    const adaptedComment = this.#adaptCommentToApp(comment);

    map[adaptedComment.id] = adaptedComment;

    return map;
  }, {})

  #validateCommentData = (commentData) => {
    Object.keys(commentData).forEach((key) => {
      if (!COMMENT_DATA_FIELDS.includes(key)) {
        throw new CommentsModelError(`Unsupported key '${key}' in CommentsModel.`);
      }
    });
  }
}

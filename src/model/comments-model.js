import AbstractModel, {ChangeType} from './abstract-model';

class CommentsModelError extends Error {}

export default class CommentsModel extends AbstractModel {
  #apiService = null;

  _data = {}

  constructor(apiService) {
    super();

    this.#apiService = apiService;
  }

  set comments(comments) {
    this._data = comments.reduce((map, comment) => {
      map[comment.id] = comment;

      return map;
    }, {});

    this._notifyObservers(ChangeType.MAJOR);
  }

  get comments() {
    return Object.values(this._data);
  }

  async getMovieComments(movieId) {
    const movieComments = await this.#apiService.getMovieComments(movieId);

    const adaptedMovieComments = this.#adaptComments(movieComments);

    this._data = {...(this._data || {}), ...adaptedMovieComments};

    this._notifyObservers(ChangeType.MAJOR);
  }

  async deleteComment(commentId) {
    try {
      await this.#apiService.deleteComment(commentId);

      delete this._data[commentId];

      this._notifyObservers(ChangeType.MINOR);
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  }

  async addComment(movieId, commentData) {
    try {
      const {comments} = await this.#apiService.addComment(movieId, commentData);

      this._data = {...(this._data || {}), ...this.#adaptComments(comments)};

      this._notifyObservers(ChangeType.MINOR);
    } catch (error) {
      console.error(error);

      return Promise.reject(error);
    }
  }

  #adaptComment = (comment) => ({
    ...comment,
    emoji: comment.emotion,
    text: comment.comment,
    date: new Date(comment.date),
  })

  #adaptComments = (comments) => comments.reduce((map, comment) => {
    const adaptedComment = this.#adaptComment(comment);

    map[adaptedComment.id] = adaptedComment;

    return map;
  }, {})
}

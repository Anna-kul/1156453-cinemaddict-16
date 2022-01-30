import AbstractModel from './abstract-model';
import {ChangeType} from '../utils/const.js';

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

    this._data = {...(this.comments || {}), ...adaptedMovieComments};

    this._notifyObservers(ChangeType.MAJOR);
  }

  async deleteComment(commentId) {
    try {
      this.getComment(commentId);

      await this.apiService.deleteComment(commentId);

      this._data = this._data.filter(({id: currentCommentId}) => currentCommentId === commentId);

      this._notifyObservers(ChangeType.MINOR);
    } catch (error) {
      return Promise.resolve();
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

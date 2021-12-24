import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomPoster = () =>{
  const poster = [
    '/images/posters/the-dance-of-life.jpg',
    '/images/posters/made-for-each-other.png',
    '/images/posters/popeye-meets-sinbad.png',
    '/images/posters/sagebrush-trail.jpg',
    '/images/posters/santa-claus-conquers-the-martians.jpg'
  ];
  const randomIndex = getRandomInteger(0, poster.length - 1);

  return poster[randomIndex];
};

export const getRandomTitle = () =>{
  const title = [
    'Sagebrush Trail',
    'The Dance of Life',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor'
  ];
  const randomIndex = getRandomInteger(0, title.length - 1);

  return title[randomIndex];
};

export const getRandomRating = () =>{
  const rating = [
    '6.3',
    '2.3',
    '9.0',
    '3.2',
    '8.3'
  ];
  const randomIndex = getRandomInteger(0, rating.length - 1);

  return rating[randomIndex];
};

const getRandomReleaseYear = () =>{
  const releaseYear = [
    '1929',
    '1933',
    '1955',
    '1964',
    '1936'
  ];
  const randomIndex = getRandomInteger(0, releaseYear.length - 1);

  return releaseYear[randomIndex];
};

export const getRandomDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    ' Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.'
  ];
  const randomIndex = getRandomInteger(0, description.length - 1);

  return description[randomIndex];
};

export const getRandomDuration = () =>{
  const duration = [
    '16m',
    '1h 21m',
    '1h 59m',
    '54m',
    '1h 55m'
  ];
  const randomIndex = getRandomInteger(0, duration.length - 1);

  return duration[randomIndex];
};

export const getRandomGenre = () =>{
  const genre = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon'
  ];
  const randomIndex = getRandomInteger(0, genre.length - 1);

  return genre[randomIndex];
};

export const getRandomEmoji = () => {
  const emoji = [
    'smile',
    'sleeping',
    'puke',
    'angry'
  ];
  const randomIndex = getRandomInteger(0, emoji.length - 1);

  return emoji[randomIndex];
};

export const getRandomAutor = () => {
  const autor = [
    'Anna',
    'Julia',
    'Denis',
    'Dmitriy',
    'Alexander'
  ];
  const randomIndex = getRandomInteger(0, autor.length - 1);

  return autor[randomIndex];
};

const getRandomCommentText = () => {
  const commentText = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
  ];
  const randomIndex = getRandomInteger(0, commentText.length - 1);

  return commentText[randomIndex];
};

const getRandomAge = () => {
  const ageRating = [
    '18+',
    '16+',
    '14+',
    '12+',
    '2+'
  ];
  const randomIndex = getRandomInteger(0, ageRating.length - 1);

  return ageRating[randomIndex];
};

const getRandomDirector = () => {
  const director = [
    'Anthony Mann',
    'hbhfbhfb',
    'gbfgbgbg',
    'dfsdfsd',
    'dfdfdfs'
  ];
  const randomIndex = getRandomInteger(0, director.length - 1);

  return director[randomIndex];
};

const getRandomActors = () => {
  const actors = [
    'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
    'lklklk',
    'kjjkj',
    'yuyuyy',
    'ffohngl'
  ];
  const randomIndex = getRandomInteger(0, actors.length - 1);

  return actors[randomIndex];
};
const getRandomWriters = () => {
  const writers = [
    'Anne Wigton, Heinz Herald, Richard Weil',
    'lklklk',
    'kjjkj',
    'yuyuyy',
    'ffohngl'
  ];
  const randomIndex = getRandomInteger(0, writers.length - 1);

  return writers[randomIndex];
};

const getRandomDateRelease = () => {
  const dateRelease = [
    '01 April 1929',
    '01 May 1933',
    '31 December1955',
    '01 July 1964',
    '20 August 1936'
  ];
  const randomIndex = getRandomInteger(0, dateRelease.length - 1);

  return dateRelease[randomIndex];
};

const getRandomCountry = () => {
  const country = [
    'USA',
    'Russia',
    'France',
    'Italy',
    'India'
  ];
  const randomIndex = getRandomInteger(0, country.length - 1);

  return country[randomIndex];
};

const generateComments = () => ({
  commentText: getRandomCommentText(),
  emoji: getRandomEmoji(),
  commentAutor: getRandomAutor(),
  commentDate: dayjs(new Date()).format('YYYY MMMM D', 'H m'),
  deleteButton: ''
});

export const generateCardFilm = () => ({
  id: nanoid(),
  poster: getRandomPoster(),
  title: getRandomTitle(),
  rating: getRandomRating(),
  releaseYear: getRandomReleaseYear(),
  description: getRandomDescription(),
  duration: getRandomDuration(),
  genre: Array.from({length: getRandomInteger(1, 3)}, getRandomGenre),
  comments: [generateComments(), generateComments(), generateComments()],
  isWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  ageRating: getRandomAge(),
  director: getRandomDirector(),
  writers: getRandomWriters(),
  actors:getRandomActors(),
  dateRelease: getRandomDateRelease(),
  country: getRandomCountry(),
});

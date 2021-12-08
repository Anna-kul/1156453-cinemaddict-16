
// import dayjs from 'dayjs';
// import {
//   getRandomEmoji,
//   getRandomAutor
// }
//   from './film.js';

// const getRandomInteger = (a = 0, b = 1) => {
//   const lower = Math.ceil(Math.min(a, b));
//   const upper = Math.floor(Math.max(a, b));

//   return Math.floor(lower + Math.random() * (upper - lower + 1));
// };

// const getRandomDirector = () => {
//   const director = [
//     'Anthony Mann',
//     'hbhfbhfb',
//     'gbfgbgbg',
//     'dfsdfsd',
//     'dfdfdfs'
//   ];
//   const randomIndex = getRandomInteger(0, director.length - 1);

//   return director[randomIndex];
// };

// const getRandomWriters = () => {
//   const writers = [
//     'Anne Wigton, Heinz Herald, Richard Weil',
//     'lklklk',
//     'kjjkj',
//     'yuyuyy',
//     'ffohngl'
//   ];
//   const randomIndex = getRandomInteger(0, writers.length - 1);

//   return writers[randomIndex];
// };

// const getRandomActors = () => {
//   const actors = [
//     'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
//     'lklklk',
//     'kjjkj',
//     'yuyuyy',
//     'ffohngl'
//   ];
//   const randomIndex = getRandomInteger(0, actors.length - 1);

//   return actors[randomIndex];
// };

// const getRandomDateRelease = () => {
//   const dateRelease = [
//     '01 April 1929',
//     '01 May 1933',
//     '31 December1955',
//     '01 July 1964',
//     '20 August 1936'
//   ];
//   const randomIndex = getRandomInteger(0, dateRelease.length - 1);

//   return dateRelease[randomIndex];
// };
// const getRandomCountry = () => {
//   const country = [
//     'USA',
//     'Russia',
//     'France',
//     'Italy',
//     'India'
//   ];
//   const randomIndex = getRandomInteger(0, country.length - 1);

//   return country[randomIndex];
// };

// const getRandomAge = () => {
//   const ageRating = [
//     '18+',
//     '16+',
//     '14+',
//     '12+',
//     '2+'
//   ];
//   const randomIndex = getRandomInteger(0, ageRating.length - 1);

//   return ageRating[randomIndex];
// };

// const getRandomCommentText = () => {
//   const commentText = [
//     'Interesting setting and a good cast',
//     'Booooooooooring',
//     'Very very old. Meh',
//     'Almost two hours? Seriously?',
//   ];
//   const randomIndex = getRandomInteger(0, commentText.length - 1);

//   return commentText[randomIndex];
// };

// export const generateComments = () => ({
//   commentText: getRandomCommentText(),
//   emoji: getRandomEmoji(),
//   commentAutor: getRandomAutor(),
//   commentDate: dayjs(new Date()).format('YYYY MMMM D', 'H m'),
//   deleteButton: ''
// });

// export const generatePopup = () => ({
//   fullPoster: getRandomPoster(),
//   title: getRandomTitle(),
//   originalTitle: getRandomTitle(),
//   rating: getRandomRating(),
//   director: getRandomDirector(),
//   writers: getRandomWriters(),
//   actors:getRandomActors(),
//   dateRelease: getRandomDateRelease(),
//   duration:getRandomDuration(),
//   country:getRandomCountry(),
//   genre:getRandomGenre(),
//   description:getRandomDescription(),
//   ageRating:getRandomAge(),
//   isWatchlist: Boolean(getRandomInteger(0, 1)),
//   isWatched: Boolean(getRandomInteger(0, 1)),
//   isFavorite: Boolean(getRandomInteger(0, 1))
// });

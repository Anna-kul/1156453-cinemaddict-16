export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const updateFilm = (films, update) => {
  const index = films.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return films;
  }

  const filmToUpdate = films[index];

  for (const key in filmToUpdate) {
    filmToUpdate[key] = update[key];
  }

  // return [
  //   ...films.slice(0, index),
  //   update,
  //   ...films.slice(index + 1),
  // ];
};

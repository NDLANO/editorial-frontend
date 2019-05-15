import React from 'react';
import PropTypes from 'prop-types';
import { ContentResultShape } from '../../../shapes';

const AddMovieOptions = ({ addedMovies, allMovies }) => {
  const options =
    addedMovies && allMovies
      ? allMovies
          .sort((a, b) => (a.title.title < b.title.title ? -1 : 1))
          .map(movie => (
            <option
              key={movie.id}
              value={movie.id}
              disabled={addedMovies.some(
                addedMovie => addedMovie.id === movie.id,
              )}>
              {movie.title.title}
            </option>
          ))
      : null;

  return options;
};

AddMovieOptions.propTypes = {
  addedMovies: PropTypes.arrayOf(ContentResultShape),
  allMovies: PropTypes.arrayOf(ContentResultShape),
};

export default AddMovieOptions;

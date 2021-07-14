import React from 'react';
import { BaseMovie } from '../NdlaFilmEditor';

interface Props {
  addedMovies: BaseMovie[];
  allMovies: BaseMovie[];
}

const AddMovieOptions = ({ addedMovies, allMovies }: Props) =>
  allMovies
    .sort((a, b) => (a.title.title < b.title.title ? -1 : 1))
    .map(movie => (
      <option
        key={movie.id}
        value={movie.id}
        disabled={addedMovies.some(addedMovie => addedMovie.id === movie.id)}>
        {movie.title.title}
      </option>
    ));

AddMovieOptions.defaultProps = {
  addedMovies: [],
  allMovies: [],
};

export default AddMovieOptions;

import React, { useState, useEffect } from "react";
import axios from "../axios";
import "../templates/row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  //isLargeRow should be used here if maintaining for specific row
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  //when this row runs, this will happen by using useEffect
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // we get the beginning URl and pass in the corresponding URL
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); //if [] is blank, runs once only

  //used for trailers
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
        //https://developers.google.com/youtube/player_parameters
        autoplay: 1,
    },
  }

  const handleClick = (movie) => {
    if (trailerUrl) {
        setTrailerUrl('');
    } else {
        movieTrailer(movie?.name || "")
        .then(url => {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get('v')) //going to get us old video url suffix
        })
        .catch((error) => console.log(error))
    }
  }

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id} //optimized for each movie, renders faster
            onClick= {() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`} //movie.poster_path originally
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;

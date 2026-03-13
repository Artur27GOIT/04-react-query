import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number,
): Promise<TMDBResponse> {
  const response = await axios.get<TMDBResponse>(`${BASE_URL}/search/movie`, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0 && query !== "") {
      toast.error("Film is not found.");
    }
  }, [isSuccess, data?.results.length, query]);

  function handleSearch(text: string) {
    setQuery(text);
    setPage(1);
  }

  function handlePageChange({ selected }: { selected: number }) {
    setPage(selected + 1);
  }

  function handleSelectMovie(movie: Movie) {
    setSelectedMovie(movie);
  }

  function handleCloseModal() {
    setSelectedMovie(null);
  }

  return (
    <>
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data?.results && (
        <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
      )}

      {(data?.total_pages ?? 0) > 1 && (
        <ReactPaginate
          pageCount={data?.total_pages ?? 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      {isFetching && <Loader />}
    </>
  );
}

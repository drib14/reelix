import { Link } from "react-router-dom";

const MovieRow = ({ title, movies }) => {
  return (
    <section className="mb-16">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-white">
          {title}
        </h2>

        <Link
          to="/movies"
          className="text-red-500 hover:text-red-400 font-semibold text-lg transition"
        >
          View All →
        </Link>
      </div>

      {/* Movie Row */}

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {movies?.map((movie, index) => (
          <Link
            key={movie._id}
            to={`/movies/${movie._id}`}
            className="relative flex-shrink-0 group"
          >
            {/* Rank Number */}

            <span className="absolute -left-5 bottom-0 text-[120px] font-black text-black opacity-90 [-webkit-text-stroke:2px_white] z-10">
              {index + 1}
            </span>

            {/* Card */}

            <div className="relative w-[220px] h-[330px] rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(229,9,20,0.35)]">

              <img
                src={movie.poster}
                alt={movie.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient */}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

              {/* Movie Info */}

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-bold text-lg text-white line-clamp-2">
                  {movie.name}
                </h3>

                <p className="text-gray-300 text-sm mt-1">
                  {movie.year}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
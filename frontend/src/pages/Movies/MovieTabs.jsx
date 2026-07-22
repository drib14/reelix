import { Link } from "react-router-dom";

const MovieTabs = ({ userInfo }) => {
  return (
    <div className="mt-16 border-t border-gray-700 pt-10">

      <h2 className="text-3xl font-bold mb-6">
        Reviews
      </h2>

      {userInfo ? (
        <div className="bg-[#111] border border-gray-700 rounded-xl p-6">

          <h3 className="text-xl font-semibold mb-2">
            Review System
          </h3>

          <p className="text-gray-400">
            Reviews will be enabled after we connect TMDB movies with MongoDB.
          </p>

        </div>
      ) : (
        <div className="bg-[#111] border border-gray-700 rounded-xl p-6">

          <p className="text-gray-400">
            Please{" "}
            <Link
              to="/login"
              className="text-red-500 hover:underline"
            >
              Sign In
            </Link>{" "}
            to write a review.
          </p>

        </div>
      )}

    </div>
  );
};

export default MovieTabs;
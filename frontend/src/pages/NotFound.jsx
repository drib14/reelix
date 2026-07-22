import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">

        <h1 className="text-red-600 text-9xl font-extrabold">
          404
        </h1>

        <h2 className="text-white text-5xl font-bold mt-6">
          Page Not Found
        </h2>

        <p className="text-gray-400 text-xl mt-6 leading-8">
          The page you are looking for doesn't exist,
          has been removed, or the URL is incorrect.
        </p>

        <div className="mt-12 flex justify-center gap-5">

          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 transition px-8 py-4 rounded-lg text-lg font-semibold text-white"
          >
            🏠 Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-800 hover:bg-gray-700 transition px-8 py-4 rounded-lg text-lg font-semibold text-white"
          >
            ← Go Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default NotFound;
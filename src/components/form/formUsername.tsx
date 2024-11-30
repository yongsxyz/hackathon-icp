import React, { useState, useEffect } from "react";
import { useProfileService } from "../../services/getUsernameLink";

const UsernameForm: React.FC = () => {
  const { saveProfile } = useProfileService();
  const [desiredUsername, setDesiredUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      saveProfile(
        event,
        desiredUsername,
        (username) => {
          //console.log("Username saved successfully:", username);
          setError(null);
        },
        (errMessage) => {
          //console.error("Error saving username:", errMessage);
          setError(errMessage);
        }
      ).finally(() => {
        setIsLoading(false);
      });
    }, 2500);
  };


  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="text-4xl font-bold text-center mb-2">
          Grab your username
        </h1>
        <p className="text-center mb-6 text-gray-500">
          Choose your username for create link bio
        </p>
        <input
          name="username"
          className="block p-2 mx-auto border w-full mb-1 text-center"
          value={desiredUsername}
          onChange={(e) => {
            // Filter hanya huruf kecil dan angka
            const filteredValue = e.target.value.replace(/[^a-z0-9]/g, "").toLowerCase();
            setDesiredUsername(filteredValue);
          }}
          type="text"
          placeholder="username"
          disabled={isLoading}
        />
        {error && (
          <div className="bg-red-200 border border-red-500 p-2 mb-2 text-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          className={`w-full text-white font-bold py-2 px-4 rounded flex items-center justify-center ${isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 2.233.966 4.243 2.514 5.669l1.486-1.378z"
                ></path>
              </svg>
              Claiming Username Link Please Wait
            </>
          ) : (
            "Claim your username"
          )}
        </button>
      </form>
    </div>
  );
};

export default UsernameForm;
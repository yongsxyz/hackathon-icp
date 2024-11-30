import React, { useState, useEffect } from "react";
import { saveUser } from "../../services/saveUser";
import { useActor } from "../../ic/Actors";

const EditProfile: React.FC = () => {
  const { saveProfile } = saveUser();
  const { actor } = useActor();

  const [profileData, setProfileData] = useState({
    name: "",
    avatarUrl: "",
    banner_url: "",
    bio: "",
    link_user: "",
    facebook: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    instagram: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setURL] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await saveProfile(
        profileData,
        (successMessage) => {
          console.log("Profile saved successfully:", successMessage);
          setError(null);
        },
        (errMessage) => {
          console.error("Error saving profile:", errMessage);
          setError(errMessage);
        }
      );
    } catch (err) {
      console.error("Unhandled error:", err);
      setError("Terjadi kesalahan tidak terduga.");
    } finally {
      setIsLoading(false);
    }
  };


  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!actor) return;

      try {
        const response = await actor.get_my_profile();
        if ("Ok" in response) {
          const profileData = response.Ok;

          // Normalize the data
          const normalizedProfileData = {
            name: profileData.name.trim() || "",
            avatarUrl: profileData.avatar_url.trim() || "",
            banner_url: profileData.banner_url.trim() || "",
            bio: profileData.bio.trim() || "",
            link_user: profileData.link.trim() || " ",
            facebook: profileData.facebook.trim() || "",
            twitter: profileData.twitter.trim() || "",
            youtube: profileData.youtube.trim() || "",
            linkedin: profileData.linkedin.trim() || "",
            instagram: profileData.instagram.trim() || "",
          };


          //set URL 
          const getURL = response.Ok.link
          setURL(getURL);
          setProfileData(normalizedProfileData);
        } else if ("Err" in response) {
          setError("Gagal mengambil profil. Silakan coba lagi nanti.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Terjadi kesalahan saat mengambil data profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [actor]);





  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-semibold text-center mb-4">Edit Profil Anda</h1>

        {url && (
          <div className="mt-4 text-center flex justify-center items-center gap-4">
            {/* Link dalam kotak */}
            <a
              href={`${window.location.origin}/${url.replace('/app/', '')}`} // Menghapus '/app/' jika ada
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
            >
              {`${window.location.origin}/${url.replace('/app/', '')}`}
            </a>
          </div>
        )}

        {Object.keys(profileData).map((field) => (
          <div key={field} className="mb-2">
            <label className="block text-gray-700 capitalize mb-1" htmlFor={field}>
              {field === "avatarUrl" ? "Avatar URL" :
                field === "link_user" ? "" :
                  field === "banner_url" ? "Banner URL" : field}
            </label>

            {field === "link_user" ? null : field === "bio" ? (
              <textarea
                id={field}
                name={field}
                value={profileData[field as keyof typeof profileData]}
                className="block w-full p-2 border rounded"
                placeholder={`Masukkan ${field}`}
                onChange={handleChange}
                disabled={isLoading}
              ></textarea>
            ) : (
              <input
                id={field}
                name={field}
                type="text"
                value={profileData[field as keyof typeof profileData]}
                className="block w-full p-2 border rounded"
                placeholder={`Masukkan ${field}`}
                onChange={handleChange}
                disabled={isLoading}
              />
            )}
          </div>
        ))}


        {/* Error Message */}
        {error && (
          <div className="bg-red-200 border border-red-500 p-2 mb-2 text-red-700 text-center rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 font-bold rounded ${isLoading
            ? "bg-gray-400 cursor-not-allowed text-gray-800"
            : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
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
              Menyimpan...
            </span>
          ) : (
            "Simpan Profil"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

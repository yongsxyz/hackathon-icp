import React, { useEffect, useState } from "react";
import Navbar from "../components/header/nav";
import AuthWallet from "../components/auth/auth";
import { useActor } from "../ic/Actors";
import UsernameForm from "../components/form/formUsername";
import EditProfile from "../components/form/formEditProfile";
import { Helmet } from "react-helmet";

import { useIsAuthenticated, useAuthType } from "../components/auth/authguard";


// Definisikan tipe untuk data profil
interface Profile {
    address: string;
    name: string;
    avatar_url: string;
    typechain: string;
    link?: string; // Properti opsional
}

export default function LandingPage() {
    const { actor } = useActor();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLinkFound, setIsLinkFound] = useState(false);

    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!actor) return;

            try {
                const response = await actor.get_my_profile();

                // Memeriksa apakah response adalah tipe { Ok: ProfileData }
                if ('Ok' in response) {
                    const profileData = response.Ok;
                    setProfile(profileData);

                    // Memeriksa apakah profileData memiliki link
                    const linkExists = !!profileData.link && profileData.link.trim() !== "";
                    setIsLinkFound(linkExists);
                } else if ('Err' in response) {
                    // Menangani kasus error jika ada
                    console.error("Error:", response.Err);
                    setIsLinkFound(false);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setIsLinkFound(false);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [actor]);

    return (
        <div>
            <Helmet>
                <title>Welcome Linkfinity</title>
                <meta
                    name="description"
                    content={`Welcome to custom profile page. Explore their bio and more!`}
                />
            </Helmet>

            <Navbar /> {/* Komponen Navbar */}
            <main
                style={{
                    backgroundColor: "#f0f8ff",
                    minHeight: "100vh",
                    padding: "20px",
                }}
            >
                <AuthWallet />
                {isAuthenticated ? (
                    isLoading ? (
                        <p>Loading...</p> // Menampilkan pesan loading selama proses fetch
                    ) : !isLinkFound ? (
                        <UsernameForm />
                    ) : (
                        <EditProfile /> 
                    )
                ) : (
                    null
                )}

            </main>
        </div>
    );
}

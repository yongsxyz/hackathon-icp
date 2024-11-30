import React, { useState, useEffect } from 'react';
import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { AuthClient } from '@dfinity/auth-client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from './authguard';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useSiwsIdentity } from "ic-use-siws-identity";

// Gambar aset
import walleticp from '../../assets/linkfintyasset/icpwallet.png';
import walleteth from '../../assets/linkfintyasset/walleteth.png';
import solana from '../../assets/linkfintyasset/solana.png';



function arrayBufferToHex(arrayBuffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(arrayBuffer);
    return Array.from(byteArray, (byte) =>
        byte.toString(16).padStart(2, "0")
    ).join("");
}


const AuthWallet: React.FC = () => {

    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();

    const { login, isLoggingIn, isPreparingLogin, clear, identity, delegationChain, identityAddress } = useSiweIdentity();
    const {
        prepareLogin: siwsPrepareLogin,
        isPrepareLoginIdle: siwsIsPrepareLoginIdle,
        prepareLoginError: siwsPrepareLoginError,
        loginError: siwsLoginError,
        identity: siwsIdentityData,
        isLoggingIn: siwsIsLoggingin,
        clear: siwsClear,
        isPreparingLogin: siwsIsPreparingLogin,
        delegationChain: swisdelegationChain,
        login: siwsLogin,
    } = useSiwsIdentity();

    // Solana modal
    const { connecting, connected, publicKey, disconnect: solanaDisconnect } = useWallet();
    const [isAuthenticatedSolana, setIsAuthenticatedSolana] = useState(false);

    const { setVisible } = useWalletModal();

    const text = () => {
        if (siwsIsLoggingin) {
            return "Login";
        }
        if (siwsIsPreparingLogin) {
            return "Logging in..";
        }
        return "Login";
    };



    const handleLoginSolana = async () => {
        if (!publicKey) {
            console.error("Wallet is not connected.");
            return;
        }

        try {
            const handlelogin = await siwsLogin();

            if (handlelogin === undefined || handlelogin === null) {
                toast.error("Login failed. Please try again or using Phantom Wallet.");
                return;
            }
        } catch (error) {
            toast.success("Logout dari Solana berhasil!");
        }
    };


    const soalanalogin = async () => {
        if (connecting) return;
        setVisible(true);
        setAuthType('SOLANA');
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (connected && publicKey) {
            setIsAuthenticatedSolana(true);
            setAuthType('SOLANA');
        } else {
            setIsAuthenticatedSolana(false);
        }
    }, [connected, publicKey]);


    const handleLogoutSolana = () => {
        solanaDisconnect();
        setIsAuthenticatedSolana(false);
        setAuthType(null);
        siwsClear();
        toast.success("Logout dari Solana berhasil!");
    };

    const { isConnected, address, status } = useAccount();

    // const { data: ensName, isLoading: isEnsLoading } = useEnsName({ address });

    // If the user switches to a different address, clear the session.
    useEffect(() => {
        if (identityAddress && address && address !== identityAddress) {
            clear();
        }
    }, [address, clear, identityAddress]);

    const isLoading = status === 'connecting' || status === 'reconnecting';


    const chainId = useChainId();
    const { disconnect } = useDisconnect(); // Destructure disconnect from wagmi

    const handleDisconnect = () => {
        // Call the disconnect function from wagmi

        disconnect();
        clear();
        setIsAuthenticatedOtherchain(false);
        setAuthType(null);

        toast.success("Logout dari EVM berhasil!");
        // Optionally, you can also close the account modal after disconnecting
        // openAccountModal();  // If you want to open the modal as well
    };

    const [authClient, setAuthClient] = useState<AuthClient | null>(null);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthenticatedOtherchain, setIsAuthenticatedOtherchain] = useState<boolean>(false);
    const [authType, setAuthType] = useState<'ICP' | 'EVM' | 'SOLANA' | null>(null);

    const [userPrincipal, setUserPrincipal] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Log status koneksi dan informasi akun
    useEffect(() => {
        setIsAuthenticatedOtherchain(isConnected ?? false);
        setAuthType(isConnected ? 'EVM' : null);
    }, [isConnected, address, chainId]);


    // Initialize AuthClient for ICP authentication
    const [isAuthStateLoading, setIsAuthStateLoading] = useState(true);

    useEffect(() => {
        const initializeAuthState = async () => {
            try {
                const client = await AuthClient.create();
                setAuthClient(client);

                const isAuthenticatedICP = await client.isAuthenticated();
                if (isAuthenticatedICP) {
                    const identity = await client.getIdentity();
                    const principal = identity.getPrincipal();

                    setUserPrincipal(principal.toText());
                    setIsAuthenticated(true);
                    setAuthType('ICP');
                } else if (isConnected) {
                    setIsAuthenticatedOtherchain(true);
                    setAuthType('EVM');
                } else if (connected && publicKey) {
                    setIsAuthenticatedSolana(true);
                    setAuthType('SOLANA');
                } else {
                    setAuthType(null);
                }
            } catch (error) {
                console.error("Error initializing auth state:", error);
            } finally {
                setIsAuthStateLoading(false);
            }
        };

        initializeAuthState();
    }, [isAuthenticated, connected, isConnected]);


    // Close modal automatically when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            setIsModalOpen(false);
        }
    }, [isAuthenticated]);

    // Handle ICP login
    const handleLoginICP = async () => {
        if (!authClient) return;

        const days = BigInt(1);
        const hours = BigInt(24);
        const nanoseconds = BigInt(3600000000000);

        try {
            await authClient.login({
                onSuccess: async () => {
                    const identity = await authClient.getIdentity();
                    const principal = identity.getPrincipal();

                    setIsAuthenticated(true);
                    setUserPrincipal(principal.toText());
                    setIsModalOpen(false); // Close modal after successful login
                    setAuthType('ICP'); // Set authType to 'ICP' after successful login
                    toast.success("Login ICP berhasil!");
                },
                identityProvider: "https://identity.ic0.app/#authorize", /// FOR MAINNET NOT FOR LOCAL
                maxTimeToLive: days * hours * nanoseconds,
            });
        } catch (error) {
            console.error('ICP Authentication failed', error);
        }
    };

    // Handle ICP logout
    const handleLogoutICP = async () => {
        if (!authClient) return;
        await authClient.logout();
        setIsAuthenticated(false);
        setUserPrincipal(null);
        setAuthType(null); // Reset authType when logging out
        toast.success("Logout dari ICP berhasil!");
    };

    // Modal Toggle
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const { setAuthState } = useAuth();

    useEffect(() => {
        if (identity || siwsIdentityData || isAuthenticated) {
            if (typeof isAuthenticated !== 'boolean' || typeof isAuthenticatedOtherchain !== 'boolean') {
                console.error('Invalid authentication state detected');
                return;
            }

            const validAuthTypes = ['ICP', 'EVM', 'SOLANA', null];
            if (!validAuthTypes.includes(authType)) {
                console.error('Invalid authType detected');
                return;
            }

            setAuthState({
                isAuthenticated: isAuthenticated || isAuthenticatedOtherchain || isAuthenticatedSolana,
                authType: authType,
            });
        } else {
            setAuthState({
                isAuthenticated: false,
                authType: null,
            });
        }
    }, [identity, isAuthenticated, isAuthenticatedOtherchain, authType, setAuthState, siwsIdentityData]);


    const handleLogin = async () => {
        try {
            await login();
            toast.success("Login Berhasil!");
        } catch (error) {
            toast.success("Gagal Login!");
        }
    };

    useEffect(() => {

        // if (isAuthenticatedSolana && (isAuthenticated || isAuthenticatedOtherchain)) {
        //     solanaDisconnect();
        //     setIsAuthenticatedSolana(false);
        // }

        if (isAuthenticated && (isAuthenticatedSolana || isAuthenticatedOtherchain)) {
            authClient?.logout();
            setIsAuthenticated(false);
            // siwsClear();
            setUserPrincipal(null);
        }

        if (isAuthenticatedOtherchain && (isAuthenticated || isAuthenticatedSolana)) {
            disconnect();
            // clear();
        }
    }, [isAuthenticated, isAuthenticatedSolana, isAuthenticatedOtherchain]);



    return (


        <div className="flex items-center justify-end ">
            {/* Tombol Connect Wallet */}
            {!isAuthenticated && !isAuthStateLoading && !isAuthenticatedSolana && !openAccountModal && (
                <button
                    onClick={toggleModal}
                    className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-3 py-2 text-sm font-medium"
                >
                    Connect Wallet
                </button>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Wallet</h2>

                        {/* Rainbow Wallet */}
                        {openConnectModal && (
                            <button
                                onClick={() => {
                                    openConnectModal();
                                    setIsModalOpen(false);
                                }}
                                className="w-full flex items-center mb-4 px-4 py-2 text-white bg-gray-900 hover:bg-purple-700 rounded-lg shadow transition duration-300"
                            >
                                <img
                                    src={walleteth}
                                    alt="Rainbow Wallet"
                                    className="w-8 h-8 rounded-full mr-3"
                                />
                                Login with Ethereum wallet
                            </button>
                        )}

                        {/* ICP Login */}
                        <button
                            onClick={handleLoginICP}
                            className="w-full flex items-center px-4 py-2 text-white bg-gray-900 hover:bg-purple-700 rounded-lg shadow transition duration-300"
                        >
                            <img
                                src={walleticp}
                                alt="ICP Wallet"
                                className="w-8 h-8 rounded-full mr-3"
                            />
                            Login with ICP Wallet
                        </button>

                        {/* Solana Wallet */}
                        <button
                            onClick={soalanalogin}
                            className="w-full flex items-center px-4 py-2 text-white bg-gray-900 hover:bg-purple-700 rounded-lg shadow transition duration-300 mt-4"
                        >
                            <img
                                src={solana}
                                alt="Solana Wallet"
                                className="w-8 h-8 rounded-full mr-3"
                            />
                            Login with SOLANA Wallet
                        </button>

                        {/* Tombol Cancel */}
                        <button
                            onClick={toggleModal}
                            className="mt-4 w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Tombol Disconnect */}


            {!isLoading && isConnected && (
                <>
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                        }) => {
                            // Note: If your app doesn't use authentication, you
                            // can remove all 'authenticationStatus' checks
                            const ready = mounted && authenticationStatus !== 'loading';
                            const connected =
                                ready &&
                                account &&
                                chain &&
                                (!authenticationStatus ||
                                    authenticationStatus === 'authenticated');



                            return (
                                <div
                                    {...(!ready && {
                                        'aria-hidden': true,
                                        'style': {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!ready) return null;
                                        if (!connected) {
                                            return (
                                                <button onClick={openConnectModal} type="button">
                                                    Connect Wallet
                                                </button>
                                            );
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <button onClick={openChainModal} type="button">
                                                    Wrong network
                                                </button>
                                            );
                                        }


                                        return (
                                            <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
                                                {!identity ? (
                                                    <button
                                                        onClick={handleLogin}
                                                        disabled={isLoggingIn || isPreparingLogin}
                                                        className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-3 py-2 text-sm font-medium"
                                                    >
                                                        {isLoggingIn ? "Logging in..." : "Login"}
                                                    </button>
                                                ) : (
                                                    <button className="text-sm font-medium text-white text-center bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-700"
                                                        onClick={() => {
                                                            const textToCopy = identity.getPrincipal().toString();
                                                            navigator.clipboard.writeText(textToCopy)
                                                                .then(() => {
                                                                    toast.success("Wallet Copied to clipboard!!");
                                                                })
                                                                .catch((err) => {
                                                                    console.error("Failed to copy text: ", err);
                                                                });
                                                        }}
                                                    >
                                                        Welcome, {identity.getPrincipal().toString()}
                                                    </button>


                                                )}

                                                <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                                                    {identity && (
                                                        <button
                                                            className="flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                                                            onClick={openChainModal}
                                                            type="button"
                                                        >
                                                            {chain.name}
                                                        </button>
                                                    )}

                                                    <button
                                                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                                                        onClick={() => {
                                                            const textToCopy = address;
                                                            navigator.clipboard.writeText(textToCopy)
                                                                .then(() => {
                                                                    toast.success("Wallet Copied to clipboard!!");
                                                                })
                                                                .catch((err) => {
                                                                    console.error("Failed to copy text: ", err);
                                                                });
                                                        }}
                                                    >
                                                        {address}
                                                    </button>

                                                    <button
                                                        onClick={handleDisconnect}
                                                        className="w-full md:w-auto px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition duration-300"
                                                    >
                                                        Disconnect Wallet
                                                    </button>
                                                </div>

                                                <div className="mt-4 space-y-4">
                                                    {delegationChain?.delegations.map((delegation) => {
                                                        const pubKey = arrayBufferToHex(delegation.delegation.pubkey);
                                                        const expiration = new Date(Number(delegation.delegation.expiration / 1000000n));

                                                        return (
                                                            <div
                                                                key={pubKey}
                                                                className="p-3 bg-white rounded-md shadow-md border border-gray-200"
                                                            >
                                                                <div className="text-sm font-medium text-gray-700">
                                                                    <span className="font-semibold">Pubkey:</span> {pubKey.slice(0, 8)}...{pubKey.slice(-8)}
                                                                </div>
                                                                <div className="text-sm font-medium text-gray-700">
                                                                    <span className="font-semibold">Expiration:</span> {expiration.toLocaleDateString()}{" "}
                                                                    {expiration.toLocaleTimeString()}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>


                                        );
                                    })()}
                                </div>
                            );
                        }}

                    </ConnectButton.Custom>

                </>
            )}

            {/* Tampilkan Informasi Solana */}
            {isAuthenticatedSolana && (
                <div className="p-4 rounded-md shadow-md bg-gray-100">
                    {publicKey ? (
                        <div className="text-center space-y-4">
                            {!siwsIdentityData ? (
                                <button
                                    onClick={handleLoginSolana}
                                    className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 text-sm font-medium"
                                >
                                    {text()}
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            const textToCopy = siwsIdentityData.getPrincipal().toString();
                                            navigator.clipboard.writeText(textToCopy)
                                                .then(() => toast.success("Wallet Copied to clipboard!!"))
                                                .catch((err) => console.error("Failed to copy text: ", err));
                                        }}
                                        className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 text-sm font-medium"
                                    >
                                        Principal: {siwsIdentityData.getPrincipal().toString()}
                                    </button>

                                    {swisdelegationChain?.delegations.map((delegation) => {
                                        const pubKey = arrayBufferToHex(delegation.delegation.pubkey);
                                        const expiration = new Date(Number(delegation.delegation.expiration / 1000000n));
                                        return (
                                            <div
                                                key={pubKey}
                                                className="p-3 bg-white rounded-md shadow-md border border-gray-200 text-left space-y-1"
                                            >
                                                <div className="text-sm font-medium text-gray-700">
                                                    <span className="font-semibold">Pubkey:</span> {pubKey.slice(0, 8)}...{pubKey.slice(-8)}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    <span className="font-semibold">Expiration:</span> {expiration.toLocaleDateString()}{" "}
                                                    {expiration.toLocaleTimeString()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            <button
                                onClick={() => {
                                    const textToCopy = publicKey ? publicKey.toBase58() : "Null";
                                    navigator.clipboard.writeText(textToCopy)
                                        .then(() => toast.success("Wallet Copied to clipboard!!"))
                                        .catch((err) => console.error("Failed to copy text: ", err));
                                }}
                                className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 text-sm font-medium"
                            >
                                Wallet: {publicKey ? publicKey.toBase58() : "Loading..."}
                            </button>

                            <button
                                onClick={handleLogoutSolana}
                                className="rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium"
                            >
                                Logout Solana
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">No wallet connected</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tampilkan Informasi ICP */}
            {isAuthenticated && (
                <div className="mt-6 text-right">
                    <p className="text-green-600 font-medium">ICP Wallet Connected</p>
                    <p className="text-sm text-gray-600">Principal: {userPrincipal}</p>
                    <button
                        onClick={handleLogoutICP}
                        className="mt-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition duration-300"
                    >
                        Logout ICP
                    </button>
                </div>
            )}
        </div>

    );

};

export default AuthWallet;

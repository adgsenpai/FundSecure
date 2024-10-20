import Modal from "@/components/shared/modal";
import { signIn, useSession } from "next-auth/react";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { LoadingDots, Google } from "@/components/shared/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [signInClicked, setSignInClicked] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [rafikiWallet, setRafikiWallet] = useState("");
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const fetchSession = async () => {
    const response = await fetch("/api/auth/session");
    const data = await response.json();
    if (!data.user) {
      router.push("/");
      return;
    }
    setUsername(data.user.email);
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleGoogleAuth = async () => {
    setSignInClicked(true);
    await signIn("google");
  };

  const handleRafikiWalletSubmit = async () => {
    if (!username) return;

    try {
      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          rafikiWallet,
        }),
      });

      if (response.ok) {
        setShowSignInModal(false);
        router.push("/dashboard");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const redirectToRafiki = () => {
    window.open("https://rafiki.money", "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (username && isSignUp && step === 1) {
      setStep(2);
    }
  }, [username, isSignUp, step]);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <Image
            src="/logo.webp"
            alt="Logo"
            width="40"
            height="40"
            className="h-10 w-10 rounded-full"
          />
          <h3 className="font-display text-2xl font-bold">
            {isSignUp ? (step === 1 ? "Sign Up" : "Add Rafiki Wallet") : "Sign In"}
          </h3>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          {isSignUp && step === 2 ? (
            <>
              <input
                type="text"
                placeholder="Enter your Rafiki wallet ID"
                value={rafikiWallet}
                onChange={(e) => setRafikiWallet(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={handleRafikiWalletSubmit}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Submit Rafiki Wallet
              </button>
              <p className="text-sm text-gray-500">
                Don't have a Rafiki wallet?{" "}
                <button
                  onClick={redirectToRafiki}
                  className="text-blue-500 hover:underline"
                >
                  Get one here
                </button>
              </p>
            </>
          ) : (
            <button
              disabled={signInClicked}
              className={`${
                signInClicked
                  ? "cursor-not-allowed border-gray-200 bg-gray-100"
                  : "border border-gray-200 bg-white text-black hover:bg-gray-50"
              } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
              onClick={handleGoogleAuth}
            >
              {signInClicked ? (
                <LoadingDots color="#808080" />
              ) : (
                <>
                  <Google className="h-5 w-5" />
                  <p>{isSignUp ? "Sign Up" : "Sign In"} with Google</p>
                </>
              )}
            </button>
          )}
          {step === 1 && (
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-center text-sm text-gray-500 hover:text-gray-600"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  );
}
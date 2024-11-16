import { useState } from "react";
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { Button } from "@/components/ui/button"
import { verify } from "../../lib/worldcoin";

export default function WorldcoinButton() {
  const [verified, setVerified] = useState(false);
  const app_id = import.meta.env.VITE_WLD_APP_ID as `app_${string}`;
  const action = import.meta.env.VITE_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    window.alert(
      "Successfully verified with World ID! Your nullifier hash is: " +
        result.nullifier_hash
    );
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log(
      "Proof received from IDKit, sending to backend:\n",
      JSON.stringify(result)
    ); // Log the proof from IDKit to the console for visibility
    const data = await verify(result);
    if (data.success) {
      setVerified(true);
      console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };

  return (
    <div>
      {/* <div className="flex flex-col items-center justify-center align-middle h-screen"> */}
        <IDKitWidget
          action={action}
          app_id={app_id}
          onSuccess={onSuccess}
          handleVerify={handleProof}
          verification_level={VerificationLevel.Orb} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
        />
        <Button
          className="h-12 w-full max-w-[200px] rounded-xl bg-backgrounds text-black font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground border border-gray-300"
          onClick={() => setOpen(true)}
        >
          {verified ? "World ID Verified!" : "Verify with World ID"}
        </Button>
      {/* </div> */}
    </div>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatTwitterHandle } from "@/lib/format";
import webProofProver from "../../../out/WebProofProver.sol/WebProofProver.json";
import webProofVerifier from "../../../out/WebProofVerifier.sol/WebProofVerifier.json";
import { mockTlsProof, mockProvingResult } from "@/mock";

import {
  createExtensionWebProofProvider,
  expectUrl,
  notarize,
  startPage,
} from "@vlayer/sdk/web_proof";

import { createVlayerClient, type WebProof, isDefined } from "@vlayer/sdk";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { Abi } from "viem";

export const Route = createFileRoute("/new")({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1),
  profilePicture: z.string().url(),
  twitterId: z.string().min(1).startsWith("@"),
  followers: z.number().min(0),
  tweets: z.number().min(0),
  priceUsd: z.number().min(0),
});

const defaultValues = {
  name: "",
  profilePicture: "",
  twitterId: "",
  followers: 0,
  tweets: 0,
  priceUsd: 0,
};

function RouteComponent() {
  const account = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();

  const [tlsProof, setTlsProof] = useState<WebProof | null>(mockTlsProof);
  // const [provingResult, setProvingResult] = useState<any | null>(null);
  const [provingResult, setProvingResult] = useState<
    typeof mockProvingResult | null
  >(mockProvingResult);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function setupRequestProveButton() {
    console.log("Generating webproof...");
    const provider = createExtensionWebProofProvider();

    const webProof = await provider.getWebProof({
      proverCallCommitment: {
        address: import.meta.env.VITE_PROVER_ADDRESS,
        proverAbi: webProofProver.abi as Abi,
        chainId,
        functionName: "main",
        commitmentArgs: ["0x"],
      },
      logoUrl: "http://twitterswap.com/logo.png",
      steps: [
        startPage("https://x.com/i/flow/login", "Go to x.com login page"),
        expectUrl("https://x.com/home", "Log in"),
        notarize(
          "https://api.x.com/1.1/account/settings.json",
          "GET",
          "Generate Proof of Twitter profile"
        ),
      ],
    });

    setTlsProof(webProof);
    console.log("WebProof generated!", webProof);
  }

  async function setupVProverButton() {
    const notaryPubKey =
      "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExpX/4R4z40gI6C/j9zAM39u58LJu\n3Cx5tXTuqhhu/tirnBi5GniMmspOTEsps4ANnPLpMmMSfhJ+IFHbc3qVOA==\n-----END PUBLIC KEY-----\n";

    const webProof = {
      tls_proof: tlsProof,
      notary_pub_key: notaryPubKey,
    };
    console.log(webProof, import.meta.env);
    const vlayer = createVlayerClient({
      url: import.meta.env.VITE_PROVER_URL,
    });

    console.log("Generating proof...");
    const hash = await vlayer.prove({
      address: import.meta.env.VITE_PROVER_ADDRESS,
      functionName: "main",
      proverAbi: webProofProver.abi as Abi,
      args: [{ webProofJson: JSON.stringify(webProof) }, account.address],
      chainId,
    });
    const provingResult = (await vlayer.waitForProvingResult(
      hash
    )) as typeof mockProvingResult;
    setProvingResult(provingResult);
    console.log("Proof generated!", provingResult);
    form.setValue("twitterId", formatTwitterHandle(provingResult[1]));
  }

  async function setupVerifyButton() {
    if (!provingResult || !client) return;
    console.log("Proving result:", provingResult);
    console.log(provingResult[0]);
    console.log(provingResult[1]);
    console.log(provingResult[2]);
    isDefined(provingResult, "Proving result is undefined");
    // const provider = await getWeb3Provider(primaryWallet!);

    try {
      const result = await writeContractAsync({
        address: import.meta.env.VITE_VERIFIER_ADDRESS,
        abi: webProofVerifier.abi,
        functionName: "verify",
        args: [provingResult[0], provingResult[1], provingResult[2]],
      });

      const receipt = await client.waitForTransactionReceipt({ hash: result });
      console.log("Transaction successful:", receipt);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    // <main className="w-full max-w-screen-md mx-auto p-4">
    <main>
      <Form {...form}>
        <div className="divide-y divide-stone/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base/7 font-semibold">Account Information</h2>
              <p className="mt-1 text-sm/6 text-gray-400">
                Use a permanent address where you can receive mail.
              </p>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full flex items-center gap-x-8">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-24 flex-none rounded-lg bg-gray-800 object-cover"
                  />
                  <div>
                    {/* <button
                      type="button"
                      className="rounded-md bg-black/10 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-black/20"
                    >
                      Change avatar
                    </button> */}
                    <Button className="mt-12" onClick={setupRequestProveButton}>
                      Create Webproof of your X account
                    </Button>
                    <Button className="mt-12" onClick={setupVProverButton}>
                      Call Vlayer Prover
                    </Button>
                    <p className="mt-2 text-xs/5 text-gray-400">
                      You need a Vlayer browser extension to generate a webproof
                    </p>
                  </div>
                </div>
                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your public display name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your public display name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="twitterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter ID</FormLabel>
                        <FormControl>
                          <Input placeholder="@username" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Your Twitter handle (starts with @)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="followers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Followers Count</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Number of Twitter followers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="tweets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tweet Count</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Total number of tweets
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="priceUsd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>Price in US dollars</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button className="mt-12" onClick={setupVerifyButton}>
                List Your Account
              </Button>
            </form>
          </div>
        </div>
      </Form>
    </main>
  );
}

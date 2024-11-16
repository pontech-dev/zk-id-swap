import React, { useState } from "react";
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatTwitterHandle } from "@/lib/format";
import { foundry } from "viem/chains";
import { Hex } from "viem";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import webProofProver from "../../../out/WebProofProver.sol/WebProofProver";
import webProofVerifier from "../../../out/WebProofVerifier.sol/WebProofVerifier";
import tlsProofData from '../../../vlayer/fj_proof.json';

import {
  createExtensionWebProofProvider,
  expectUrl,
  notarize,
  startPage,
} from "@vlayer/sdk/web_proof";

import {
  createVlayerClient,
  type WebProof,
  type Proof,
  isDefined,
} from "@vlayer/sdk";

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
  const { primaryWallet } = useDynamicContext();

  const [tlsProof, setTlsProof] = useState<WebProof | null>(tlsProofData);
  const [provingResult, setProvingResult] = useState<any | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  async function setupRequestProveButton() {
    const provider = createExtensionWebProofProvider();
    const webProof = await provider.getWebProof({
      proverCallCommitment: {
        address: import.meta.env.VITE_PROVER_ADDRESS,
        proverAbi: webProofProver.abi,
        chainId: foundry.id,
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
    console.log(webProof);
    const vlayer = createVlayerClient({
      url: import.meta.env.VITE_PROVER_URL,
    });

    console.log("Generating proof...");
    const hash = await vlayer.prove({
      address: import.meta.env.VITE_PROVER_ADDRESS,
      functionName: "main",
      proverAbi: webProofProver.abi,
      args: [
        {
          webProofJson: JSON.stringify(webProof),
        },
        primaryWallet?.address,
      ],
      chainId: import.meta.env.VITE_CHAIN_NAME.id,
    });
    const provingResult = await vlayer.waitForProvingResult(hash);
    setProvingResult(provingResult as [Proof, string, Hex]);
    console.log("Proof generated!", provingResult);
    form.setValue("twitterId", formatTwitterHandle(provingResult[1]));
};

  // async function setupVerifyButton() {
  //   isDefined(provingResult, "Proving result is undefined");
  //   const txHash = await ethClient.writeContract({
  //       address: import.meta.env.VITE_VERIFIER_ADDRESS,
  //       abi: webProofProver.abi,
  //       functionName: "verify",
  //       args: provingResult,
  //       chain,
  //       account: account,
  //     });
  //     const verification = await ethClient.waitForTransactionReceipt({
  //       hash: txHash,
  //       confirmations,
  //       retryCount: 60,
  //       retryDelay: 1000,
  //     });
  //     console.log("Verified!", verification);
  // };

  return (
    <main className="w-full max-w-screen-md mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Button className="mt-12" onClick={setupRequestProveButton}>
            Create Webproof of your X account
          </Button>
          <Button className="mt-12" onClick={setupVProverButton}>
            Call Vlayer Prover
          </Button>
          <div className="flex justify-cente">
            <Avatar className="size-24 bg-muted">
              <AvatarImage src={form.watch("profilePicture")} />
            </Avatar>
          </div>
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>URL of your profile picture</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>Your public display name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@username"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormDescription>
                  Your Twitter handle (starts with @)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="followers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Followers Count</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Number of Twitter followers</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tweets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tweet Count</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Total number of tweets</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceUsd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Price in US dollars</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}

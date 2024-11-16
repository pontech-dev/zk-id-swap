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
import { getWeb3Provider,getSigner, } from '@dynamic-labs/ethers-v6'
import webProofProver from "../../../out/WebProofProver.sol/WebProofProver";
import webProofVerifier from "../../../out/WebProofVerifier.sol/WebProofVerifier";
import tlsProofData from '../../../vlayer/fj_proof.json';
import { Contract } from 'ethers';

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
  // const [provingResult, setProvingResult] = useState<any | null>(null);
  const [provingResult, setProvingResult] = useState<any | null>([
    {
      seal: {
        verifierSelector: "0xdeafbeef",
        seal: [
          "0x356578b7675cc471ed4dd4a8ad7191c9cc23b6a10b3603fc7b537c100fd14e33",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ],
        mode: 1
      },
      callGuestId: "0xc0f59f76de44b1700c2de89e0eeffbbad523e049b6beef55441f371811f62767",
      length: 768,
      callAssumptions: {
        functionSelector: "0xc822d5ef",
        proverContractAddress: "0x3f15ea4bda79d1a4398e035e59f582f79393b2aa",
        settleBlockNumber: 19963130,
        settleBlockHash: "0x19f29876ee7edc1eb653c5bf70b3104ba6919bde56d2bf346b82563a1d7fbf32"
      }
    },
    "wasabi_devcon",
    "0x7AFf5e8F1c3eB926b8f1E7b196aDc108fb7a00b2"
  ]);

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

  async function setupVerifyButton() {
    console.log("Proving result:", provingResult);
    console.log(provingResult[0]);
    console.log(provingResult[1]);
    console.log(provingResult[2]);
    isDefined(provingResult, "Proving result is undefined");
    // const provider = await getWeb3Provider(primaryWallet!);
    const signer = await getSigner(primaryWallet!);

    const contract = new Contract(import.meta.env.VITE_VERIFIER_ADDRESS, webProofVerifier.abi, signer)

    try {
        const tx = await contract.verify(provingResult[0], provingResult[1], provingResult[2], {
          gasLimit: 500000,
      });
        const receipt = await tx.wait();
        console.log("Transaction successful:", receipt);
    } catch (error) {
        console.error("Transaction failed:", error);
    }
  };

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
          <Button className="mt-12" onClick={setupVerifyButton}>
            Call Vlayer Verifier
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

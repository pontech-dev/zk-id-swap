import { Twitter } from "@/components/icons/twitter";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getChainImage } from "@/constants";
import { useShopItem } from "@/hooks/use-shop-items";
import { formatShopItemPrice } from "@/lib/format";
import { createFileRoute } from "@tanstack/react-router";
import {
  usePublicClient,
  useChains,
  useWriteContract,
} from "wagmi";
import escrow from "../../../../out/Escrow.sol/MarketplaceEscrow.json";

export const Route = createFileRoute("/shop/$itemId")({
  component: RouteComponent,
});

const parseItemId = (itemId: string) => {
  const [chainId, id] = itemId.split("-");
  return { chainId: parseInt(chainId), id };
};

function RouteComponent() {
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  const { itemId } = Route.useParams();
  const { chainId, id } = parseItemId(itemId);
  const { data: shopItem } = useShopItem(chainId, id);
  const chains = useChains();
  const chain = chains.find((c) => c.id === chainId);

  if (!shopItem) return null;

  async function onSubmitDeposit() {
    if (!client) return;
    try {
      const result = await writeContractAsync({
        address: import.meta.env.VITE_ESCROW_ADDRESS,
        abi: escrow.abi,
        functionName: "deposit",
        args: ["peaceandwhisky", "10"],
      });
  
      const receipt = await client.waitForTransactionReceipt({ hash: result });
      console.log("Transaction successful:", receipt);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <main className="@container p-4 sm:px-8 max-w-screen-md w-full mx-auto">
      <div className="flex flex-col @lg:flex-row gap-4 items-center">
        <div className="w-full @lg:w-1/2 px-10 @lg:px-0">
          <Avatar className="w-full h-auto aspect-square rounded-2xl">
            <AvatarImage src={shopItem.thumbnail} />
            <AvatarFallback>{shopItem.name.split(".")[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full @lg:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold">{shopItem.name}</h1>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium text-muted-foreground text-xl">
                ID Provider
              </div>
              <div className="text-xl font-bold flex items-center gap-2">
                <Twitter className="size-5" />
                Twitter
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-muted-foreground text-xl">
                Price
              </div>
              <div className="text-xl font-bold">
                {`${formatShopItemPrice(shopItem.price)} ${shopItem.price.token.symbol}`}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-muted-foreground text-xl">
                Listing Chain
              </div>
              <div className="flex items-center gap-1">
                <img
                  src={getChainImage(chainId)}
                  alt={chain?.name}
                  className="w-6 h-6"
                />
                <p className="text-xl font-bold">{chain?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full">
              Chat to Seller
            </Button>
            <Button className="w-full" onClick={onSubmitDeposit}>Buy 🚀</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

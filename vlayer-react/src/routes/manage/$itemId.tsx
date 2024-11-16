import { createFileRoute } from "@tanstack/react-router";
import { useShopItem } from "@/hooks/use-shop-items";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { formatShopItemPrice } from "@/lib/format";

export const Route = createFileRoute("/manage/$itemId")({
  component: RouteComponent,
});

const parseItemId = (itemId: string) => {
  const [chainId, id] = itemId.split("-");
  return { chainId: parseInt(chainId), id };
};

function RouteComponent() {
  const { itemId } = Route.useParams();

  const { chainId, id } = parseItemId(itemId);
  const { data: shopItem } = useShopItem(chainId, id);
  if (!shopItem) return null;

  return (
    <>
      <div className="mt-16">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
            <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
              <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                  {/* <div>
                    <dt className="font-medium text-gray-900">Order number</dt>
                    <dd className="mt-1 text-gray-500">{shopItem.number}</dd>
                  </div> */}
                  <div className="">
                    <dt className="font-medium text-gray-900">Date placed</dt>
                    <dd className="mt-1 text-gray-500">
                      <time dateTime={shopItem.createdDatetime}>
                        {shopItem.createdDate.toDateString()}{" "}
                      </time>
                    </dd>
                  </div>
                </dl>

                <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                  <a
                    // href={order.href}
                    className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span>View Order</span>
                  </a>
                  <a
                    // href={order.invoiceHref}
                    className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span>View Invoice</span>
                    <span className="sr-only">for order {shopItem.id}</span>
                  </a>
                </div>

                <div className="p-4 sm:p-6 col-span-4">
                  <div className="flex items-center sm:items-start">
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:size-40">
                      <img
                        alt={shopItem.thumbnail}
                        src={shopItem.thumbnail}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="ml-6 flex-1 text-sm">
                      <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                        <h5>{shopItem.name}</h5>
                        <p className="mt-2 sm:mt-0">
                          {" "}
                          {`${formatShopItemPrice(shopItem.price)} ${shopItem.price.token.symbol}`}
                        </p>
                      </div>
                      <p className="text-gray-500 sm:mt-2 sm:block">
                        {shopItem.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 sm:flex sm:justify-between">
                    <div className="flex items-center">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="size-5 text-green-500"
                      />
                      <p className="ml-2 text-sm font-medium text-gray-500">
                        Delivered on{" "}
                        {/* <time dateTime={order.deliveredDatetime}>
                          {order.deliveredDate}
                        </time> */}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                      <div className="flex flex-1 justify-center">
                        <a
                          // href={product.href}
                          className="whitespace-nowrap text-indigo-600 hover:text-indigo-500"
                        >
                          View product
                        </a>
                      </div>
                      <div className="flex flex-1 justify-center pl-4">
                        <a
                          href="#"
                          className="whitespace-nowrap text-indigo-600 hover:text-indigo-500"
                        >
                          Buy again
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

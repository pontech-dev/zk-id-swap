import { createFileRoute, Link } from "@tanstack/react-router";
import { useTradingItems } from "@/hooks/use-trading-items";
import { ChevronRightIcon } from "lucide-react";

export const Route = createFileRoute("/manage/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tradingItems = useTradingItems();

  return (
    <>
      {tradingItems.data?.pages.map((page) =>
        page.map((item) => (
          <Link
            key={item.id}
            href={`/manage/${item.chainId}-${item.id}`}
            className="relative flex justify-between py-5 px-6 sm:px-8 bg-white border-b border-gray-200"
          >
            <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
              <img
                alt=""
                src={item.thumbnail}
                className="size-12 flex-none rounded-full bg-gray-50"
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {item.name}
                </p>
                <p className="mt-1 flex text-xs/5 text-gray-500">
                  <a
                    href={`mailto:${item.id}`}
                    className="relative truncate hover:underline"
                  >
                    @{item.id}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
              <div className="hidden sm:block">
                <div className="mt-1 flex items-center gap-x-1.5">
                  {item.status == "selling" ? (
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                    </div>
                  ) : (
                    <div className="flex-none rounded-full bg-red-500/20 p-1">
                      <div className="size-1.5 rounded-full bg-red-500" />
                    </div>
                  )}
                  <p className="text-xs/5 text-gray-500">{item.status}</p>
                </div>
              </div>
              <ChevronRightIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400"
              />
            </div>
          </Link>
        ))
      )}
    </>
  );
}

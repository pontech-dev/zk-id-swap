'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface MoonPayWebSdk {
  init: (options: {
    flow: string
    environment: string
    variant: string
    params: {
      apiKey: string
      baseCurrencyCode: string
      baseCurrencyAmount: string
      defaultCurrencyCode: string
    }
  }) => { show: () => void }
}

declare global {
  interface Window {
    MoonPayWebSdk: MoonPayWebSdk
  }
}

export default function MoonPayButton() {
  const [sdkLoaded, setSdkLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://static.moonpay.com/web-sdk/v1/moonpay-web-sdk.min.js"
    script.async = true
    script.onload = () => setSdkLoaded(true)
    script.onerror = () => console.error("Failed to load MoonPay SDK.")
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!sdkLoaded || !window.MoonPayWebSdk) return

    const moonpaySdk = window.MoonPayWebSdk.init({
      flow: "buy",
      environment: "sandbox",
      variant: "overlay",
      params: {
        apiKey: "pk_test_jAvItRNgJo6FVW6BEGaoHQYb6LXi4yQg",
        baseCurrencyCode: "usd",
        baseCurrencyAmount: "30",
        defaultCurrencyCode: "eth",
      },
    })

    const handleButtonClick = () => {
      moonpaySdk.show()
    }

    const button = document.getElementById("moonpayButton")
    button?.addEventListener("click", handleButtonClick)

    return () => {
      button?.removeEventListener("click", handleButtonClick)
    }
  }, [sdkLoaded])

  if (!sdkLoaded) {
    return <div>Loading...</div>
  }

  return (
    <Button
      id="moonpayButton"
      variant="outline"
      className="h-12 w-full max-w-[120px] rounded-xl bg-background text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      Onramp
    </Button>
  )
}
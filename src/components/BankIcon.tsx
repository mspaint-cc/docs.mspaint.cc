"use client";

// import { useTheme } from "next-themes"
// import { useEffect, useState } from "react"
import { PaymentItem } from "./PaymentItem"

export function BankIcon({ name }: { name?: string }) {
  /*const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <PaymentItem icon="bank-white.svg" name={name ?? "Bank Remittance (Contact Reseller)"} />
  return <PaymentItem icon={theme === "dark" ? "bank-white.svg" : "bank-dark.svg"} name={name ?? "Bank Remittance (Contact Reseller)"} />*/
  return <PaymentItem icon="bank-white.svg" name={name ?? "Bank Remittance (Contact Reseller)"} />;
}
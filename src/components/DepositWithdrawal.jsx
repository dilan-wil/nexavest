import Link from "next/link"

export default function DepositWithdrawButtons() {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <Link href="/deposit" passHref>
        <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined">add_circle</span>
          Deposit
        </button>
      </Link>
      <Link href="/withdraw" passHref>
        <button className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined">remove_circle</span>
          Withdraw
        </button>
      </Link>
    </div>
  )
}
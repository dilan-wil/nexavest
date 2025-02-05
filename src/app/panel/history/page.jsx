"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DepositWithdrawButtons } from "@/components/DepositWithdrawal";
import { useAuth } from "@/components/context/auth-context";
import { useEffect } from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return "check_circle"
    case "pending":
      return "hourglass_empty"
    case "failed":
      return "error"
    default:
      return "help"
  }
}

export default function TransactionHistory() {
  const { transactions } = useAuth();

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  const statusColors = {
    success: "bg-green-100 text-green-800",
    redeemed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="w-full max-w-[1200px] bg-gray-50 p-4 md:p-6 rounded-xl mx-auto">
      <Card className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Pending
            </Badge>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Failed
            </Badge>
          </div>
        </header>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${transaction.iconBg} rounded-full flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-gray-600">{transaction.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.title}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={`font-semibold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <Badge variant="secondary" className={`flex items-center gap-1 ${getStatusColor(transaction.status)}`}>
                  <span className="material-symbols-outlined text-sm">{getStatusIcon(transaction.status)}</span>
                  <span className="capitalize">{transaction.status}</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

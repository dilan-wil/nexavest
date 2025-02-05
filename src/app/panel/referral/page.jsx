"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Copy, Layers } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { listenToSubCollection } from "../../../functions/get-a-sub-collection";

const referralLevels = [
  { level: 1, count: 5, earnings: 100 },
  { level: 2, count: 3, earnings: 50 },
  { level: 3, count: 1, earnings: 25 },
];

export default function Referral() {
  const { userInfo, user } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false)
  const [referralLink, setReferralLink] = useState("");
  const [referrals, setReferrals] = useState([])

  useEffect(() => {
    if (userInfo?.uid) {
      setReferralLink(`https://helionix.vercel.app/register?code=${userInfo?.uid}`);
    }
  }, [userInfo]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy the referral link: ", err);
    }
  };

  const shareLink = async () => {
    try {
      await navigator.share({
        title: "Invite to Bitcoin Works",
        url: referralLink,
      });
    } catch (err) {
      console.error("Failed to share the referral link: ", err);
    }
  };


  useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }

    const unsubscribe = listenToSubCollection("users", user.uid, "referrals", setReferrals);

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };

  }, [user, setReferrals])

  useEffect(() => {
    console.log(referrals)
  }, [user, referrals])


  if (!userInfo) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">
          <Skeleton width={200} />
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton width={150} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton height={20} />
              <Skeleton height={40} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton width={150} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton height={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton width={150} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton height={50} width={100} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] bg-gray-50 p-4 md:p-6 rounded-xl mx-auto">
      <Card className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">Your Referral Dashboard</h1>
          <div className="relative">
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-2 rounded-lg hover:bg-gray-50">
                <span className="material-symbols-outlined">help</span>
                How it works
              </summary>
              <div className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                <p className="text-sm">
                  Earn rewards by referring others! Get up to 3 levels deep of referral bonuses.
                </p>
              </div>
            </details>
          </div>
        </div>

        <div className="bg-gray-50 p-4 md:p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              value={referralLink}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
            <Button
              onClick={copyToClipboard}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">content_copy</span>
              {copiedLink ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6 rounded-xl border border-blue-100 transform hover:scale-102 transition-all">
            <h3 className="font-semibold mb-2">Referral Earnings</h3>
            <p className="text-3xl font-bold mb-2">$1,234.56</p>
            <p className="text-sm">Total earnings from referrals</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6 rounded-xl border border-blue-100 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold mb-2">Level 1</h3>
                <p className="text-3xl font-bold mb-2">15%</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Level 2</h3>
                <p className="text-3xl font-bold mb-2">10%</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Level 3</h3>
                <p className="text-3xl font-bold mb-2">5%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {["Level 1 Referrals (24)", "Level 2 Referrals (156)", "Level 3 Referrals (892)"].map((level, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <details>
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <span
                      className={`material-symbols-outlined ${
                        index === 0 ? "text-blue-500" : index === 1 ? "text-purple-500" : "text-emerald-500"
                      }`}
                    >
                      {index === 0 ? "group" : index === 1 ? "share" : "hub"}
                    </span>
                    <h3 className="font-semibold">{level}</h3>
                  </div>
                  <span className="material-symbols-outlined">expand_more</span>
                </summary>
                <div className="px-6 pb-6 overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="text-left bg-gray-50">
                      <tr>
                        <th className="p-3 rounded-l-lg">User</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 rounded-r-lg">Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">John Doe</td>
                        <td className="p-3">2023-05-15</td>
                        <td className="p-3">$125.50</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">Jane Smith</td>
                        <td className="p-3">2023-05-14</td>
                        <td className="p-3">$98.75</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
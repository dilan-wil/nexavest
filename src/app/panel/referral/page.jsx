"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Copy, Layers } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { listenToSubCollection } from "../../../functions/get-a-sub-collection";
import { Input } from "@/components/ui/input"

const referralLevels = [
  { level: 1, count: 5, earnings: 100 },
  { level: 2, count: 3, earnings: 50 },
  { level: 3, count: 1, earnings: 25 },
];

export default function Referral() {
  const { userInfo, user, referrals } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false)
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    if (userInfo?.uid) {
      setReferralLink(`https://nexavest.onrender.com/signup?code=${userInfo?.uid}`);
    }
  }, [userInfo]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
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
    <div className="w-full max-w-[1200px] pb-24 p-4 md:p-6 rounded-xl mx-auto">
      <Card className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">Votre panel de parrainage</h1>
          <div className="relative">
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer list-none px-4 py-2 rounded-lg hover:bg-gray-50">
                <span className="material-symbols-outlined">help</span>
                Comment ça marche
              </summary>
              <div className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                <p className="text-sm">
                  Gagnez une commission en parainnant vos amis jusqu'à 3 niveaux
                </p>
              </div>
            </details>
          </div>
        </div>

        <div className="bg-gray-50 p-4 md:p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Votre lien de parrainage</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              value={referralLink}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
            <Button
              onClick={copyLink}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">content_copy</span>
              {copiedLink ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6 rounded-xl border border-blue-100 transform hover:scale-102 transition-all">
            <h3 className="font-semibold mb-2">Gains de parrainage</h3>
            <p className="text-3xl font-bold mb-2">XAF{userInfo?.referralEarnings ?? 0}</p>
            <p className="text-sm">Totals gagnés en parrainant</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6 rounded-xl border border-blue-100 transform hover:scale-102 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold mb-2">Niveau 1</h3>
                <p className="text-3xl font-bold mb-2">15%</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Niveau 2</h3>
                <p className="text-3xl font-bold mb-2">6%</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">NIveau 3</h3>
                <p className="text-3xl font-bold mb-2">3%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {[`Level 1 Referrals (${referrals?.length ?? 0})`].map((level, index) => (
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
                        <th className="p-3 rounded-l-lg">Utilisateur</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 rounded-r-lg">Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {referrals?.map((ref) => (
                        <tr className="hover:bg-gray-50">
                          <td className="p-3">{ref.name}</td>
                          <td className="p-3">Fev 2025</td>
                        </tr>
                      ))}
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
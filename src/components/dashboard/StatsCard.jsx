import React from "react";
import { Card, CardContent } from "../ui/card/Card";
import { FileText, Inbox, Send, CheckCircle, XCircle } from "lucide-react";

// const stats = [
//   { icon: <Inbox className="text-blue-500" />, label: "Surat Masuk", value: 120 },
//   { icon: <Send className="text-green-500" />, label: "Surat Keluar", value: 80 },
//   { icon: <FileText className="text-purple-500" />, label: "Dokumen", value: 200 },
//   { icon: <CheckCircle className="text-green-600" />, label: "Disposisi", value: 60 },
//   { icon: <XCircle className="text-red-500" />, label: "Ditolak", value: 10 },
// ];

export default function StatsCard({stats}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 bg-gray-100 rounded-full">
                <Inbox className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Surat Masuk</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.masuk}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 bg-gray-100 rounded-full">
                <Send className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Surat Keluar</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.keluar}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 bg-gray-100 rounded-full">
                <FileText className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dokumen</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.dokumen}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 bg-gray-100 rounded-full">
                <CheckCircle className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Disposisi</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.disposisi}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 bg-gray-100 rounded-full">
                <XCircle className="text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ditolak</p>
              <h4 className="text-xl font-semibold text-gray-800">{stats.ditolak}</h4>
            </div>
          </CardContent>
        </Card>
      
    </div>
  );
} 
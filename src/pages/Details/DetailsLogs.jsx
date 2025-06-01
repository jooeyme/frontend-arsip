// src/pages/LogPerubahanList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card/Card";
import Badge  from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { getAllLog } from "../../modules/fetch/log-perubahan";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function LogPerubahanList() {
  const [logs, setLogs] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await getAllLog();
      setLogs(res.data);
      console.log("isi logs:", res.data)
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  const toggleExpanded = (id) => {
    console.log("ada ga")
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
        <PageBreadcrumb pageTitle="Riwayat Log Perubahan" />
      {logs.length === 0 ? (
        <p className="text-gray-500">Tidak ada log perubahan tersedia.</p>
      ) : (
        <>
      {logs
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((log) => {
        const isExpanded = expandedIds.includes(log.id);
        return (
        <Card
          key={log.id}
          className="hover:shadow-md transition cursor-pointer"
          
        >
            <div
    onClick={() => toggleExpanded(log.id)}
    className="cursor-pointer"
  >
          <CardContent className="py-4 space-y-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">
                {log.keterangan || "- Tidak ada keterangan -"}
              </h3>
              {!log.isRead && <Badge variant="destructive">Baru</Badge>}
            </div>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(log.createdAt), {
                addSuffix: true,
                locale: id,
              })}
            </p>
            <p className="text-sm text-gray-600">Aksi: {log.aksi}</p>
            {isExpanded && log.perubahan && (
                  <div className="text-sm text-gray-700 space-y-1">
                    {Object.entries(log.perubahan).map(([key, value]) => (
                      <div key={key}>
                        <strong className="capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
                        {value && typeof value === "object" && "old" in value && "new" in value ? (
                          <div className="ml-2">
                            <p className="text-red-600">
                              <span className="font-semibold">Sebelumnya:</span>{" "}
                              {key.includes("path") ? (
                                <a
                                  href={value.old}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline"
                                >
                                  Lihat Dokumen Lama
                                </a>
                              ) : (
                                value.old
                              )}
                            </p>
                            <p className="text-green-600">
                              <span className="font-semibold">Sekarang:</span>{" "}
                              {key.includes("path") ? (
                                <a
                                  href={value.new}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline"
                                >
                                  Lihat Dokumen Baru
                                </a>
                              ) : (
                                value.new
                              )}
                            </p>
                          </div>
                        ) : (
                          <span>
                            {key.includes("path") ? (
                              <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Lihat Dokumen
                              </a>
                            ) : (
                              value?.toString() || "-"
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                    </div>
                )}
          </CardContent>
          </div>
        </Card>
      )})}
      </>
      )}
    </div>
  );
}

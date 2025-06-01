import Button from "../ui/button/Button";
import { PlusCircle } from "lucide-react";

export default function QuickActions({ onAddSuratMasuk, onAddSuratKeluar }) {
  return (
    <div className="mt-6 flex gap-4 flex-wrap">
      <Button onClick={onAddSuratMasuk} variant="outline" className="gap-2">
        <PlusCircle /> Tambah Surat Masuk
      </Button>
      <Button onClick={onAddSuratKeluar} className="gap-2" variant="outline">
        <PlusCircle /> Tambah Surat Keluar
      </Button>
    </div>
  );
}

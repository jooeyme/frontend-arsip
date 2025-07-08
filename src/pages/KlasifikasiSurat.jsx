import ComponentCard from "../components/common/ComponentCard";
import ManageKlasSurat from "../components/common/ManageKlasSurat";



export default function KlasifikasiSurat() {
  

  return (
    <>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        Klasifikasi Surat
      </h2>
      </div>
    <div className="space-y-6">
      <ComponentCard title="Daftar Klasifikasi">
        <ManageKlasSurat />
      </ComponentCard>
      
    </div>
    </>
  );
}

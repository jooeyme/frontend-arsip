import ComponentCard from "../components/common/ComponentCard";
import ManageTembusan from "../components/common/ManageTembusan";

export default function Tembusan() {
  

  return (
    <>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        Tembusan Surat
      </h2>
      </div>
    <div className="space-y-6">
      <ComponentCard title="Daftar Tembusan">
        <ManageTembusan />
      </ComponentCard>
      
    </div>
    </>
  );
}

import ComponentCard from "../components/common/ComponentCard";
import ManageUsers from "../components/common/ManageUser";



export default function PengaturanUsers() {
  

  return (
    <>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        Pengguna
      </h2>
      </div>
    <div className="space-y-6">
      <ComponentCard title="Daftar Pengguna">
        <ManageUsers />
      </ComponentCard>
      
    </div>
    </>
  );
}

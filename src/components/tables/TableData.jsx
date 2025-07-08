import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SuratKeluarDataTable({ me, }) {
  const tableRef = useRef();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const $table = $("<table class='table-auto min-w-[1102px] w-full text-left text-sm text-gray-700 dark:text-gray-300 overflow-hidden bg-white dark:bg-white/[0.03]'></table>");
    $(tableRef.current).html($table); // inject table ke dalam div

    const table = $table.DataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: "http://localhost:3000/api/surat-keluar/datatables",
        type: "GET",
        data: function (d) {
          d.status = filterStatus;
        },
        dataSrc: function (json) {
          //console.log("DATA DARI BACKEND:", json); // 👈 cek apakah ada isian field yang undefined
          return json.data;
        }
      },
      dom: 
      "<'flex justify-between items-center m-4 px-2'<'dataTables_length'l><'dataTables_filter'f>>" + // l: length (show entries), f: filter (search)
        "t" + // t: table
        "<'flex justify-between items-center mt-2 px-2'<'dataTables_info'i><'dataTables_paginate'p>>", // i: info, p: pagination
      buttons: [],
      columns: [
        {
          className: "dt-control",
          orderable: false,
          data: null,
          defaultContent: ""
        },
        { data: "no_surat", title: "No Surat", defaultContent: "-"  },
        {
          data: "tgl_surat",
          title: "Tanggal",
          render: (d) => {
            if (!d) return "-";
            const date = new Date(d);
            return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID");
          },
          defaultContent: "-" ,
        },
        { data: "perihal", title: "Perihal", defaultContent: "-"  },
        { data: "ditujukan", title: "Ditujukan", defaultContent: "-"  },
        { data: "keterangan", title: "Keterangan", defaultContent: "-"  },
        {
          data: "status",
          title: "Status",
          render: (s) => 
          {
            let cls = "inline-block px-2 py-1 text-sm rounded-xl ";
            if (s === "draft") cls += "bg-gray-100 text-gray-800";
            else if (s === "review") cls += "bg-blue-100 text-blue-800";
            else if (s === "waiting_for_signature") cls += "bg-yellow-100 text-yellow-800";
            else if (s === "signed") cls += "bg-purple-100 text-purple-800";
            else if (s === "archived") cls += "bg-gray-200 text-gray-600";
            else cls += "bg-green-100 text-green-800";

            return `<span class="${cls}">${s}</span>`;
          },
          defaultContent: "-" ,
        },

        {
          data: null,
          title: "Aksi",
          orderable: false,
          render: (data, type, row) => {
            const btnDetail = `<button class='btn-detail px-3 py-1.5 my-1 text-xs font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600' data-id='${row.id}'>Detail</button>`;
            const btnDelete =
              me === "administrasi"
                ? `<button class='btn-delete px-3 py-1.5 my-1 text-xs font-semibold bg-red-500 text-white rounded-md hover:bg-red-600' data-id='${row.id}'>Delete</button>`
                : "";
            return btnDetail + " " + btnDelete;
          },
        },
      ],
      order: [[1, "asc"]],

      

      initComplete: function () {
      // Tambahkan class Tailwind ke thead dan tbody
      const thead = $table.find("thead");
      const tbody = $table.find("tbody");

      thead.addClass("border-b border-gray-100 dark:border-white/[0.05]");
      thead.find("th").addClass("px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400");

      tbody.find("tr").addClass("divide-y divide-gray-100 dark:divide-white/[0.05]");
      tbody.find("td").addClass("px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400");
      
      
      $('.dataTables_filter input')
          .addClass('px-3 py-2 border rounded-md text-sm text-gray-700')
          .attr('placeholder', 'Cari...');

        // Styling info (e.g. "Menampilkan 1-10 dari 100")
        $('.dataTables_info').addClass('flex text-sm items-center text-gray-600');

        // Styling pagination
       const $paginate = $(".dataTables_paginate");
        $paginate.addClass("flex justify-end text-sm items-center border border-gray-300 rounded-md overflow-hidden"); // Tambahkan border luar pada pagination container

        // Ubah semua tombol pagination
        $paginate.find("a").each(function () {
          const $btn = $(this);
          const text = $btn.text();

          // Hapus kelas default dari DataTables untuk reset styling
          $btn.removeClass('paginate_button current');

          // Tambahkan class Tailwind untuk styling dasar setiap tombol
          $btn.addClass('px-3 py-1.5 text-xs border-r border-gray-300 last:border-r-0 transition-colors duration-200');

          // Style khusus untuk tombol aktif (current)
          if ($btn.hasClass("current") || $btn.text() === table.page.info().page + 1) { // Periksa juga berdasarkan teks untuk nomor halaman
            $btn.addClass("bg-blue-500 text-white border-blue-500");
          }
          // Style untuk tombol "First", "Previous", "Next", "Last" dan angka non-aktif
          else {
            $btn.addClass("text-blue-500 bg-white hover:bg-gray-100");
          }

          // Handle tombol disabled (jika ada)
          if ($btn.hasClass('disabled')) {
            $btn.removeClass('hover:bg-gray-100 text-blue-500').addClass('text-gray-400 bg-white cursor-not-allowed');
          }
        });

        // Hapus gap antar tombol, karena border-r sudah menangani pemisah
        $paginate.removeClass('gap-2');


        // Styling "Show entries" dropdown
        $(".dataTables_length select").addClass("px-3 py-2 border rounded-md text-sm text-gray-700");
      },
    });

    // Expandable row
    $table.on("click", "td.dt-control", function () {
      const tr = $(this).closest("tr");
      const row = table.row(tr);

      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass("shown");
      } else {
        row.child(formatChild(row.data())).show();
        tr.addClass("shown");
      }
    });

    // Aksi detail
    $table.on("click", ".btn-detail", function () {
      const id = $(this).data("id");
      navigate(`/detail-surat-keluar/${id}`);
    });

    // Aksi delete
    $table.on("click", ".btn-delete", function () {
      const id = $(this).data("id");
      Swal.fire({
        title: "Hapus data?",
        text: "Data akan dihapus permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
      }).then((res) => {
        if (res.isConfirmed) {
          fetch(`http://localhost:3000/api/surat-keluar/${id}`, {
            method: "DELETE",
          })
            .then((r) => r.json())
            .then(() => {
              Swal.fire("Terhapus", "Data berhasil dihapus", "success");
              table.ajax.reload();
            })
            .catch(() => {
              Swal.fire("Error", "Gagal menghapus", "error");
            });
        }
      });
    });
    

    return () => {
      table.destroy(true);
    };
  }, [navigate, me, filterStatus]);

  // function formatChild(data) {
  //   return `
  //     <table class='w-full text-left'>
  //       <tr><td><strong>No Surat:</strong></td><td>${data.no_surat}</td></tr>
  //       <tr><td><strong>Keterangan:</strong></td><td>${data.keterangan}</td></tr>
  //       <tr><td><strong>Sifat:</strong></td><td>${data.sifat}</td></tr>
  //       <tr><td><strong>Jenis:</strong></td><td>${data.jenis}</td></tr>
  //     </table>
  //   `;
  // }

  function formatChild(data) {
  return `
    <table class="w-full text-left table-auto">
      <tbody>
        <tr>
          <td><strong>No Surat:</strong></td>
          <td>${data.no_surat || "-"}</td>
        </tr>
        <tr>
          <td><strong>Keterangan:</strong></td>
          <td>${data.keterangan || "-"}</td>
        </tr>
        <tr>
          <td><strong>Ditujukan:</strong></td>
          <td>${data.ditujukan || "-"}</td>
        </tr>
        <tr>
          <td><strong>Sifat:</strong></td>
          <td>${data.sifat || "-"}</td>
        </tr>
        <tr>
          <td><strong>Jenis:</strong></td>
          <td>${data.jenis || "-"}</td>
        </tr>
        <tr>
          <td><strong>Tembusan:</strong></td>
          <td>${data.tembusan || "-"}</td>
        </tr>
        <tr>
          <td><strong>No folder:</strong></td>
          <td>${data.no_folder || "-"}</td>
        </tr>
        <tr>
          <td><strong>Updated:</strong></td>
          <td>${data.updatedAt || "-"}</td>
        </tr>
      </tbody>
    </table>
  `;
}


  return (
    <div className="overflow-x-auto">
      <div className="mb-2">
        <label className="mr-2 font-semibold">Filter Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">Semua</option>
          <option value="draft">Draft</option>
          <option value="signed">Signed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

        <div className="overflow-hidden p-8 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1102px]">
              <div ref={tableRef}></div>
            </div>
          </div>
        </div>
   
    </div>
  );
}

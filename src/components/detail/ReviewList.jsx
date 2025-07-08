// src/components/ReviewList.jsx
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useModal } from '../../hooks/useModal';
import { getReviewsBySuratId, updateReview, createReview } from '../../modules/fetch/review';
import ReviewEditModal from './ReviewEditModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Swal from 'sweetalert2';
import TextArea from '../form/input/TextArea'
import Select from '../form/Select';
import { options } from '@fullcalendar/core/preact.js';
import Badge from '../ui/badge/Badge';

export default function ReviewList({ data, currentStatus, refreshData }) {
  //const [reviews, setReviews] = useState(data);
  const modal = useModal();
  const editModal = useModal();
  const [selectedReview, setSelectedReview] = useState(null);
  const [status, setStatus]     = useState('approved');
  const [komentar, setKomentar] = useState('');

  const canReview = ['draft','under_review','revisi'].includes(currentStatus);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      Swal.fire({ title:'Mengirim...', didOpen:() => Swal.showLoading(), allowOutsideClick:false });
      const payload = { status, komentar };
      await createReview(suratId, payload);
      Swal.close();
      Swal.fire('Sukses','Review tersimpan','success');
      // reload
      const { data } = await getReviewsBySuratId(suratId);
      refreshData();
    } catch (err) {
      Swal.close();
      console.error(err);
      Swal.fire('Error', err.response?.data?.message||err.message,'error');
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    editModal.openModal();
  };

  const handleSaved = (updated) => {
    refreshData();
    editModal.closeModal();
  };

  const handleSelect = (value) => {
    
    setStatus(value);
  };

  const options = [
    { value: 'approved', label: 'Approved'},
    { value: 'revisi', label: 'Rvisi'}
  ]
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
        Review
      </h4>
      {data.length === 0 ? (
        <p className="text-gray-500">Belum ada review.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((r) => (
            <li key={r.id} className="p-4">
              <div className="flex flex-col p-4 border border-gray-200 dark:border-gray-800 rounded-2xl gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div className="xl:w-100">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Reviewer   
                  </p> 
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {r.reviewer?.nama_lengkap || r.reviewerId}
                  </p>
                  
                </div>
                <div className="xl:w-100">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status     
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  <Badge
                      variant="solid"
                      size="md"
                      color={
                        r.status === "revisi"
                          ? "review"
                          : r.status === "approved"
                          ? "diterima"
                          : "error"
                      }
                    >
                      {r.status}
                  </Badge>
                  </p>
                
                </div>
                <div className="xl:w-100">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Komentar    
                  </p> 
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {r.komentar || '-'}
                  </p>
                
                </div>
                <div className="xl:w-100">
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Waktu review
                  </p>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  {format(new Date(r.createdAt), 'dd MMM yyyy, HH:mm', { locale: id})}
                </p>
                </div>
              </div>
              
              {/* <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>
                Edit
              </Button> */}
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
      </div>
{/* 
        {canReview && (
          <div className="mt-4">
            <Button onClick={modal.openModal} variant='outline' className="px-4 py-2">
              Buat Review
            </Button>
          </div>
        )} */}

        <Modal isOpen={modal.isOpen} onClose={modal.closeModal} className="max-w-[750px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Buat Review
            </h4>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="h-[450px] overflow-y-auto px-2">
                <div className="grid grid-cols-1 gap-x-6">
              <div>
                <Label>Keputusan</Label>
                <Select
                  options={options}
                  value={status}
                  onChange={handleSelect}
                  className='dark:bg-dark-900'
                >
                  
                </Select>
              </div>

              <div>
                <Label>Komentar {status==='revisi' && <span className="text-red-500">*</span>}</Label>
                <TextArea
                  value={komentar}
                  onChange={e => setKomentar(e.target.value)}
                  rows={4}
                  placeholder="Masukkan komentar..."
                  required={status==='revisi'}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={modal.closeModal}>
                  Batal
                </Button>
                <Button type="submit" variant='submit'>
                  Kirim
                </Button>
              </div>
              </div>
              </div>
            </form>
          </div>
          
        </Modal>
      
    
      {/** Modal untuk edit review */}
      <ReviewEditModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        review={selectedReview}
        onSaved={handleSaved}
      />
    </div>
  );
}

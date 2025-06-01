// src/components/ReviewEditModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal }          from '../ui/modal';
import Input              from '../form/input/InputField';
import Select             from '../form/Select';
import Button             from '../ui/button/Button';
import Swal               from 'sweetalert2';
import { updateReview }   from '../../modules/fetch/review';

export default function ReviewEditModal({ isOpen, onClose, review, onSaved }) {
  const [status, setStatus]     = useState('');
  const [komentar, setKomentar] = useState('');

  const statusOptions = [
    { value: 'revisi',   label: 'Revisi' },
    { value: 'approved', label: 'Approved' },
  ];

  useEffect(() => {
    if (review) {
      setStatus(review.status);
      setKomentar(review.komentar || '');
    }
  }, [review]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: 'Menyimpan...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const { data } = await updateReview(review.id, { status, komentar });
      Swal.close();
      Swal.fire('Tersimpan!', '', 'success');
      onSaved(data);
    } catch (err) {
      Swal.close();
      console.error(err);
      Swal.fire('Error', err.message || 'Gagal menyimpan', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <form onSubmit={handleSave} className="p-6 space-y-4">
        <h4 className="text-xl font-semibold">Edit Review</h4>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Komentar</label>
          <Input
            type="text"
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tambah komentar…"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}

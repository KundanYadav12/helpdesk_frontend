 




import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/AxiosIntances';
import { selectToken } from '../redux/authSlice';
import { toast } from 'react-toastify';

const UploadTicket = () => {
  const token = useSelector(selectToken);

  const ticketSchema = z.object({
    title: z.string().min(1, 'Text must be at least 5 characters long'),
    content: z.string().min(5, 'Text must be at least 5 characters long'),
    attachment: z.any().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.attachment && data.attachment[0]) {
      formData.append('attachment', data.attachment[0]);
    }

    try {
      const res = await axiosInstance.post('/tickets/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
       
      toast.success('Ticket created successfully!');
      reset();
    } catch (error) {
      toast.error('Error uploading ticket');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">       
      <h2>Upload Ticket</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <div className="form-group">
          <label htmlFor="text">Title</label>
          <input
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            id="title"
            {...register('title')}
          />
          {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="text">Description</label>
          <textarea
            className={`form-control ${errors.text ? 'is-invalid' : ''}`}
            id="text"
            {...register('content')}
          />
          {errors.content && <div className="invalid-feedback">{errors.content.message}</div>}
        </div>

        <div className="form-group mt-3">
          <label htmlFor="attachment">Attachment (optional)</label>
          <input
            type="file"
            className="form-control"
            id="attachment"
            {...register('attachment')}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">Submit Ticket</button>
      </form>
    </div>
  );
};

export default UploadTicket;

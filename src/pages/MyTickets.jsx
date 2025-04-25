

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/authSlice';
import axiosInstance from '../api/AxiosIntances';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const token = useSelector(selectToken);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axiosInstance.get('/tickets/my-tickets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched tickets:', data);
        setTickets(data);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      }
    };

    fetchTickets();
  }, [token]);

  return (
    <div className="container mt-4">
        
      <h2 className="mb-4">My Uploaded Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket._id} className="card mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">{ticket.title}</h5>
              <p className="card-text">
                {ticket.notes[0]?.content || ticket.notes[0]?.text || 'No initial note'}
              </p>
              <p className="text-muted">
                Status: <strong>{ticket.status}</strong>
              </p>

              {ticket.notes.length > 1 && (
                <div>
                  <h6 className="mt-3">Replies:</h6>
                  {ticket.notes.slice(1).map((note) => (
                    <div key={note._id} className="border p-2 mb-2 rounded bg-light">
                      <p className="mb-1">{note.content || note.text}</p>
                      <small className="text-muted">
                        — {note.author?.name} ({note.author?.role})
                      </small>
                      {note.attachment && (
                        <div className="mt-1">
                          <a
                            href={`http://localhost:5000/${note.attachment.replace(/\\/g, '/')}`}
                            download
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-paperclip me-1"></i>Download Attachment
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyTickets;



 
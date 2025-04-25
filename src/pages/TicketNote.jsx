
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/AxiosIntances';
import { selectToken } from '../redux/authSlice';

const TicketNotes = () => {
  const { id } = useParams(); // ticket ID
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const token = useSelector(selectToken);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axiosInstance.get(`/tickets/${id}/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [id, token]);

  const handleReply = async (noteId) => {
    if (!replyText[noteId]) return;
    try {
      const res = await axiosInstance.post(
        `/notes/${noteId}/reply`,
        { text: replyText[noteId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the specific note in state with the new reply
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === noteId ? res.data : note))
      );

      // Clear the reply input
      setReplyText({ ...replyText, [noteId]: '' });
    } catch (err) {
      console.error('Failed to submit reply:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Ticket Notes</h3>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : notes.length === 0 ? (
        <p>No notes found for this ticket.</p>
      ) : (
        <div className="row">
          {notes.map((note) => (
            <div className="col-md-6 mb-4" key={note._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-person-circle me-2"></i>
                    {note.author.name}{' '}
                    <small className="text-muted">({note.author.role})</small>
                  </h5>

                  <p className="card-text mt-2">{note.text}</p>

                  {note.attachment && (
                    <div className="mt-3">
                      <a
                        href={`http://localhost:5000/uploads/${note.attachment}`}
                        className="btn btn-sm btn-outline-primary"
                        download
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bi bi-paperclip me-1"></i>
                        Download Attachment
                      </a>
                    </div>
                  )}

                  {/* Replies */}
                  {note.replies && note.replies.length > 0 && (
                    <div className="mt-3 border-top pt-3">
                      <h6>Replies</h6>
                      {note.replies.map((reply) => (
                        <div key={reply._id} className="mb-2 ps-2 border-start border-2 border-secondary">
                          <p className="mb-1">
                            <strong>{reply.author.name}</strong> ({reply.author.role})
                          </p>
                          <p className="mb-1 ps-2">{reply.text}</p>
                          <small className="text-muted ps-2">
                            {new Date(reply.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                <div className="card-footer bg-light">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Write a reply..."
                    value={replyText[note._id] || ''}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [note._id]: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-sm btn-outline-success mt-2"
                    onClick={() => handleReply(note._id)}
                    disabled={!replyText[note._id]}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketNotes;

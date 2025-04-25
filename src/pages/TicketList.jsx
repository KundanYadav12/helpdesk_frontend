




import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/AxiosIntances'; // your Axios setup with baseURL & token
import { Modal, Form, Card, Spinner, Button } from 'react-bootstrap'; // assuming Bootstrap is used
import { PlusCircle } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { Trash } from 'react-bootstrap-icons'; // or use any delete icon
import { toast } from 'react-toastify';

const AllTicketsWithNotes = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentTicketId, setCurrentTicketId] = useState(null);
    const [noteContent, setNoteContent] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [editStatusTicketId, setEditStatusTicketId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const { user } = useSelector(state => state.auth);

    const fetchTickets = async () => {
        try {
            const res = await axiosInstance.get('/tickets/allnotes');
            setTickets(res.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchTickets();
    }, []);


    const handleAddNoteClick = (ticketId) => {
        setCurrentTicketId(ticketId);
        setShowModal(true);
    };

    const handleStatusChange = async (ticketId) => {
        try {
            await axiosInstance.put(`/tickets/${ticketId}/status`, { status: newStatus });
            setTickets(prev =>
                prev.map(ticket =>
                    ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
                )
            );
            setEditStatusTicketId(null);
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update ticket status');
        }
    };


    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', noteContent);
        if (attachment) formData.append('attachment', attachment);

        try {
            await axiosInstance.post(`/tickets/${currentTicketId}/add-note`, formData);
            setShowModal(false);
            setNoteContent('');
            setAttachment(null);
            fetchTickets(); // Refresh notes
        } catch (err) {
            console.error('Error adding note:', err);
            toast.error('Error adding note:', err);
        }
    };

    const handleDeleteClick = (ticketId) => {
        setTicketToDelete(ticketId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosInstance.delete(`/tickets/${ticketToDelete}`);
            setTickets((prev) => prev.filter(t => t._id !== ticketToDelete)); // Update UI
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Failed to delete ticket:", error);         
            toast.error("Error deleting ticket");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setTicketToDelete(null);
    };

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

    return (
        <div className="container mt-4">
            <h3>All Tickets with Notes</h3>
            {tickets.map(ticket => (
                <Card key={ticket._id} className="mb-4">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                {/* <Card.Title>
                                    {ticket.title} <small className="text-muted">({ticket.status})</small>
                                </Card.Title> */}
                                <Card.Title>
                                    {ticket.title}{' '}
                                    {(user?.role === 'admin' && editStatusTicketId === ticket._id) ? (
                                        <>
                                            <select
                                                className="form-select form-select-sm d-inline w-auto"
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                className="ms-2"
                                                onClick={() => handleStatusChange(ticket._id)}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="ms-2"
                                                onClick={() => setEditStatusTicketId(null)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <small
                                                className={`ms-2 badge ${ticket.status === 'Active'
                                                        ? 'bg-success'
                                                        : ticket.status === 'Pending'
                                                            ? 'bg-warning text-dark'
                                                            : 'bg-secondary'
                                                    }`}
                                            >
                                                {ticket.status}
                                            </small>
                                            {user?.role === 'admin' && (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="p-0 ms-2"
                                                    onClick={() => {
                                                        setEditStatusTicketId(ticket._id);
                                                        setNewStatus(ticket.status);
                                                    }}
                                                >
                                                    ✏️
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </Card.Title>

                                <Card.Subtitle className="mb-2 text-muted">
                                    Customer: {ticket.customer?.name || 'Unknown'}
                                </Card.Subtitle>
                                <Card.Text><strong>Last Updated:</strong> {new Date(ticket.lastUpdated).toLocaleString()}</Card.Text>
                            </div>

                            {(user?.role === 'admin' || user?.role === 'agent') && (
                                <div>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleAddNoteClick(ticket._id)}
                                        title="Add Note"
                                    >
                                        <PlusCircle className="me-1" />
                                        Add Note
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => handleDeleteClick(ticket._id)}
                                        title="Delete Ticket"
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <h5>Notes</h5>
                        {ticket.notes.length === 0 ? (
                            <p>No notes added.</p>
                        ) : (
                            ticket.notes.map((note, index) => (
                                <div key={index} className="border p-2 mb-2">
                                    <p><strong>By:</strong> {note.author?.name || 'Unknown'} ({note.author?.role})</p>
                                    <p><strong>Content:</strong> {note.content}</p>
                                    {note.attachment && (
                                        <p>
                                            <strong>Attachment:</strong>{' '}
                                            <a href={`/${note.attachment}`} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        </p>
                                    )}
                                    <small className="text-muted">Added on: {new Date(note.timestamp).toLocaleString()}</small>
                                </div>
                            ))
                        )}
                    </Card.Body>
                </Card>
            ))}



            {/* Bootstrap Modal for Adding Note */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form onSubmit={handleNoteSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Note</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Note Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Attachment (optional)</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setAttachment(e.target.files[0])}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Add Note</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this ticket? This action cannot be undone.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default AllTicketsWithNotes;

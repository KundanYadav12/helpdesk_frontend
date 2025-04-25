import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Navbar, Nav, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { BoxArrowRight } from 'react-bootstrap-icons'; // Icon
import { HouseDoorFill, TicketPerforatedFill, CloudUploadFill, Speedometer2 } from 'react-bootstrap-icons';

const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const role = useSelector((state) => state.auth.role);


    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div>
            {/* Header for small screens */}
            <Navbar bg="dark" variant="dark" className="d-md-none d-flex justify-content-between px-3">
                {/* <Container> */}
                <Navbar.Brand>Helpdesk</Navbar.Brand>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    <BoxArrowRight className="me-1" />
                    Logout
                </Button>
                {/* </Container> */}
            </Navbar>

            <Container fluid>
                <Row className="flex-md-nowrap">
                    {/* Sidebar */}
                    <Col
                        md={2}
                        className="bg-light d-none d-md-flex flex-column p-3 min-vh-100 shadow-sm"
                    >
                        <h4 className="mb-4">Helpdesk</h4>


                        {(role === 'admin') && (
                            <Button
                                variant="outline-primary"
                                className="mb-2"
                                onClick={() => navigate('/dashboard')}
                            >
                                Dashboard
                            </Button>
                        )}
                        <Button
                            variant="outline-secondary"
                            className="mb-2"
                            onClick={() => navigate('/my-tickets')}
                        >
                            Profile
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="mb-2"
                            onClick={() => navigate('/upload-ticket')}
                        >
                            Upload
                        </Button>
                        {(role === 'admin' || role === 'agent') && (
                            <Button
                                variant="outline-secondary"
                                className="mb-2"
                                onClick={() => navigate('/tickets')}
                            >
                                TicketList
                            </Button>
                        )}

                        <Button
                            variant="danger"
                            className="mt-auto"
                            onClick={handleLogout}
                        >
                            <BoxArrowRight className="me-1" />
                            Logout
                        </Button>
                    </Col>

                    {/* Main Content */}
                    <Col md={9} className="p-3">
                        <Outlet />
                    </Col>
                </Row>
            </Container>

            {/* Footer for small screens */}

            <footer className="d-md-none bg-light border-top fixed-bottom p-2">
                <Container className="d-flex justify-content-around text-center">
                    {role === 'admin' && (
                        <Button variant="light" size="sm" onClick={() => navigate('/dashboard')}>
                            <div><Speedometer2 size={20} /></div>
                            <small>Dashboard</small>
                        </Button>
                    )}

                    <Button variant="light" size="sm" onClick={() => navigate('/my-tickets')}>
                        <div><HouseDoorFill size={20} /></div>
                        <small>My Tickets</small>
                    </Button>

                    <Button variant="light" size="sm" onClick={() => navigate('/upload-ticket')}>
                        <div><CloudUploadFill size={20} /></div>
                        <small>Upload</small>
                    </Button>

                    {(role === 'admin' || role === 'agent') && (
                        <Button variant="light" size="sm" onClick={() => navigate('/tickets')}>
                            <div><TicketPerforatedFill size={20} /></div>
                            <small>Tickets</small>
                        </Button>
                    )}
                </Container>
            </footer>
        </div>
    );
};

export default Layout;

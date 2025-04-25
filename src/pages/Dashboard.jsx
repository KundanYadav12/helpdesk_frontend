import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Modal, Button, Spinner } from 'react-bootstrap';
import { PeopleFill, PersonBadgeFill,PersonWorkspace,  ClipboardData } from 'react-bootstrap-icons';
import axiosInstance from '../api/AxiosIntances';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/tickets/dashboard-summary');
        setData(res.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (type) => {
    let title = '', list = [];
    if (!data) return;
  
    switch (type) {
      case 'tickets':
        title = 'All Tickets';
        list = data.ticketTitles || [];
        break;
      case 'customers':
        title = 'Consumers List';
        list = data.consumers || [];
        break;
      case 'agents':
        title = 'Agent List';
        list = data.agents || [];
        break;
      case 'admins':
        title = 'Admin List';
        list = data.admins || [];
        break;
      default:
        return;
    }
  
    setModalTitle(title);
    setModalContent(list);
    setModalShow(true);
  };
    
 

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-white bg-primary" onClick={() => handleCardClick('tickets')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <ClipboardData size={32} />
                <div>
                  <h5>Total Tickets</h5>
                  <h3>{data.totalTickets}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-white bg-success" onClick={() => handleCardClick('customers')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <PeopleFill size={32} />
                <div>
                  <h5>Consumers</h5>
                  <h3>{data.totalConsumers}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-white bg-warning" onClick={() => handleCardClick('agents')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <PersonBadgeFill size={32} />
                <div>
                  <h5>Agents</h5>
                  <h3>{data.totalAgents}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-white bg-danger" onClick={() => handleCardClick('admins')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                < PersonWorkspace size={32} />
                <div>
                  <h5>Admins</h5>
                  <h3>{data.totalAdmins}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {modalContent.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;

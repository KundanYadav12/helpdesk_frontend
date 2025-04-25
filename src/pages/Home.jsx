
import React from 'react';
import { useNavigate } from 'react-router-dom';
import helpdesk_bg from '../assets/helpdesk_bg.jpg';

function Home() {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                backgroundImage: `url(${helpdesk_bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div
                className="text-center p-4 rounded"
                // style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', maxWidth: '500px', width: '100%' }}
                style={{ color: "white" }}
            >
                <h1 className="mb-3">Welcome to HelpDesk Portal</h1>
                <p className="lead mb-4">Please login or register to continue.</p>
               

                <div className="d-flex justify-content-center gap-3">
                    <button
                        className="btn btn-outline-primary rounded-pill px-4 py-2 custom-btn"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                    <button
                        className="btn btn-outline-secondary rounded-pill px-4 py-2 custom-btn"
                        onClick={() => navigate('/register')}
                    >
                        SignUp
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Home;

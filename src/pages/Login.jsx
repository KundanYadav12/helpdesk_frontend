

// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { setUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'react-toastify';

// Zod validation schema
const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formError, setFormError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const handleLogin = async () => {
        try {
            // ✅ Validate with Zod
            loginSchema.parse(formData);

            // ✅ Dispatch Redux login thunk
            const resultAction = await dispatch(loginUser(formData));

            if (loginUser.fulfilled.match(resultAction)) {
                const userData = resultAction.payload;

                // ✅ Store user in userSlice
                dispatch(setUser(userData));

                // ✅ Store in localStorage manually (optional, already done in authSlice)
                localStorage.setItem('login', 'true');
                localStorage.setItem('userRole', userData.role);

                toast.success('Login successful');
                // alert('Login successful');
                navigate('/my-tickets');
            } else {
                setFormError(resultAction.payload || 'Login failed');
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                setFormError(err.errors[0].message);
            } else {
                setFormError('Something went wrong');
            }
        }
    };

    return (



        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-4">Help Desk</h3>
                <h5 className="mb-3 text-center">Login</h5>
                {formError && <div className="alert alert-danger">{formError}</div>}
                <input
                    className="form-control mb-2"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                />
                <input
                    className="form-control mb-3"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                />
                <button className="btn btn-success w-100" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>

    );
}

export default Login;

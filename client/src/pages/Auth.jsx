import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    try {
      const { data } = await axios.post(endpoint, form);
      login(data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      )}
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create Account' : 'Already have an account?'}
      </p>
    </form>
  );
}

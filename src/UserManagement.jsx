import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Password changed successfully!');
      } else {
        setMessage(data.message || 'Failed to change password.');
      }
    } catch (err) {
      setMessage('An error occurred connecting to the server.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>User Management</h2>
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div style={{ marginBottom: '10px' }}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>Update Password</button>
      </form>
      {message && <p style={{ marginTop: '15px', color: 'blue' }}>{message}</p>}
      <br />
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}
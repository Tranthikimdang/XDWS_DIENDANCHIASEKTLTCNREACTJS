import React, { useEffect, useState } from 'react';
import api from '../../../apis/mentorApi';
import { Table, Button, Snackbar, Alert, Dialog } from '@mui/material';

function Mentor() {
  const [mentors, setMentors] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.getMentors();
        setMentors(response.data);
      } catch (error) {
        setError("Error fetching mentors");
      }
    };
    fetchMentors();
  }, []);

  const deleteMentor = async (id) => {
    try {
      await api.deleteMentor(id);
      setMentors(mentors.filter((mentor) => mentor.id !== id));
      setSnackbarOpen(true);
    } catch (error) {
      setError("Error deleting mentor");
    }
  };

  return (
    <div>
      <Table>
        {mentors.map((mentor) => (
          <tr key={mentor.id}>
            <td>{mentor.id}</td>
            <td>{mentor.user_id}</td>
            <td>{mentor.isApproved ? 'Approved' : 'Not Approved'}</td>
            <td>
              <Button onClick={() => deleteMentor(mentor.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </Table>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Mentor deleted successfully"
      />
      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
}

export default Mentor;

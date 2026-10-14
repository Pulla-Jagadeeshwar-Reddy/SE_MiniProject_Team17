import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <section>
      <h1>Collaborative Study Material &amp; Quiz Platform</h1>
      {user ? (
        <p>You are logged in as <strong>{user.role}</strong>. Use the menu above to get started.</p>
      ) : (
        <p>
          Share study material, practise with quizzes and track your progress. <Link to="/login">Log in</Link> to
          continue.
        </p>
      )}
    </section>
  );
}

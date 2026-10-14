import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <section>
      <h1>Access denied</h1>
      <p>You don't have permission to view this page. <Link to="/">Go home</Link></p>
    </section>
  );
}

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p><Link to="/">Go home</Link></p>
    </section>
  );
}

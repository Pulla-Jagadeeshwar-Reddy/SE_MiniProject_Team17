import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../roles';

/**
 * Same navigation, logout and help on every screen (NFR-QUAL-01).
 * Shows only the links the user's role may use (SAD 4.6).
 * Add your module's link to NAV_LINKS with the roles allowed to see it.
 */
const NAV_LINKS = [
  { to: '/materials', label: 'Materials', roles: [ROLES.STUDENT, ROLES.FACULTY] },
  { to: '/questions', label: 'Question Bank', roles: [ROLES.FACULTY] },
  { to: '/quizzes', label: 'Quizzes', roles: [ROLES.STUDENT, ROLES.FACULTY] },
  { to: '/performance', label: 'Performance', roles: [ROLES.STUDENT, ROLES.FACULTY] },
  { to: '/groups', label: 'Study Groups', roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN] },
  { to: '/profile', label: 'Profile', roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN] },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const links = user ? NAV_LINKS.filter((l) => l.roles.includes(user.role)) : [];

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">Study &amp; Quiz</NavLink>
      <nav aria-label="Main">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
        ))}
        <NavLink to="/help">Help</NavLink>
        {user ? (
          <button type="button" className="link-button" onClick={logout}>
            Logout ({user.role})
          </button>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}

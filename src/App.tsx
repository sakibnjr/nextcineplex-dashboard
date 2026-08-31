import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { OverviewPage } from './features/overview/pages/OverviewPage';
import { MoviesPage } from './features/movies/pages/MoviesPage';
import { CinemasPage } from './features/cinemas/pages/CinemasPage';
import { ShowtimesPage } from './features/showtimes/pages/ShowtimesPage';
import { BookingsPage } from './features/bookings/pages/BookingsPage';
import { SnacksPage } from './features/snacks/pages/SnacksPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="cinemas" element={<CinemasPage />} />
        <Route path="showtimes" element={<ShowtimesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="snacks" element={<SnacksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
    </Routes>
  );
}

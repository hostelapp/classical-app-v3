import { useMemo } from 'react';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import NotFoundPage from './NotFoundPage';
import { useBasePath } from '../utils/useBasePath';

const AppRouter = () => {
  const { currentPath } = useBasePath();

  const page = useMemo(() => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/admin':
        return <AdminPage />;
      default:
        return <NotFoundPage requestedPath={currentPath} />;
    }
  }, [currentPath]);

  return page;
};

export default AppRouter;

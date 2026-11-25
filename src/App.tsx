import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { CustomCursor } from '@/components/ui/CustomCursor';

export const App: React.FC = () => {
  return (
    <>
      <CustomCursor />
      <RouterProvider router={router} />
    </>
  );
};

export default App;

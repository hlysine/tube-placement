import React from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import TubePlacement from './tube-placement/TubePlacement';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TubePlacement />,
  },
]);

const container = document.querySelector('#root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

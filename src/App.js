import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root';
import ErrorElement from './pages/ErrorElement';
import Home from './components/Home/Home';
import Form from './components/Form/Form';
import CardDetails from './components/Card/CardDetails';
import Profile from './components/Profile/Profile';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Order from './components/Order/Order';
import Display from './components/Display/Display';



function App() {
  
  

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorElement />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/sell', element: <Form /> },
        { path: '/product/:productId', element: <CardDetails /> },
        { path: '/profile', element: <Profile /> },
        { path: '/sold', element: <Products/> },
        { path: '/cart', element: <Cart /> }, 
        { path: '/orders', element: <Order /> },
        { path: '/sold/edit', element: <Form /> },
        { path: '/display', element: <Display /> },
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;

import React, { ReactNode } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
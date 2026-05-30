'use client'
import { Header } from '@/components/layout/Header';

import { Sidebar } from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleOpenSidebar() {
    setIsSidebarOpen(prevState => !prevState);
  }

  return (
    <>
      <Header onOpenSidebar={handleOpenSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      {children}
    </>
  );
}
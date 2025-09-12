import { useState } from 'react';

export const useTabs = () => {
  const [activeTab, setActiveTab] = useState('convert');

  return {
    activeTab,
    setActiveTab
  };
};
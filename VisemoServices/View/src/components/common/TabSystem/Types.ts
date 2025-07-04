export interface Tab {
    id: string;
    label: string;
  }
  
  export interface TabSystemProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    children: React.ReactNode;
  }
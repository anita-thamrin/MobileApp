import React, { createContext, useContext, useState } from 'react';

const ComplaintsContext = createContext();

export const useComplaints = () => {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
};

export const ComplaintsProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);

  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaint = (id, updates) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === id ? { ...complaint, ...updates } : complaint
      )
    );
  };

  const deleteComplaint = (id) => {
    setComplaints(prev => prev.filter(complaint => complaint.id !== id));
  };

  const getComplaint = (id) => {
    return complaints.find(complaint => complaint.id === id);
  };

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        addComplaint,
        updateComplaint,
        deleteComplaint,
        getComplaint,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
};
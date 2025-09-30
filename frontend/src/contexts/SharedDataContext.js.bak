import React, { createContext, useContext } from 'react';

const SharedDataContext = createContext();

export const useSharedData = () => {
  return {
    members: [],
    prizes: [],
    items: [],
    users: [],
    branches: [],
    transactions: [],
    addMember: () => {},
    updateMember: () => {},
    deleteMember: () => {},
    addPrize: () => {},
    updatePrize: () => {},
    deletePrize: () => {},
    addItem: () => {},
    updateItem: () => {},
    deleteItem: () => {},
    addUser: () => {},
    updateUser: () => {},
    deleteUser: () => {},
    addBranch: () => {},
    updateBranch: () => {},
    deleteBranch: () => {},
    addTransaction: () => {},
    getMemberTransactions: () => [],
    searchMembers: () => [],
    recognizeBarcode: () => ({ type: 'unknown' })
  };
};

export const SharedDataProvider = ({ children }) => {
  return (
    <SharedDataContext.Provider value={{}}>
      {children}
    </SharedDataContext.Provider>
  );
};

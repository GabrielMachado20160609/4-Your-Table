import React, { createContext, useContext } from 'react'

const CompanyContext = createContext<any>(undefined);

export const CompanyProvider: React.FC<{children : React.ReactNode}> = ({ children }) => {
  return (
    <CompanyContext.Provider values= {{
        
    }}>

    </CompanyContext.Provider>
  )
}

export const useCompanyContext = (): CompanyRepository => {
    const context = useContext(CompanyContext);
    if (!context) {
      throw new Error('useCompanyContext must be used within a UserProvider');
    }
    return context;
};

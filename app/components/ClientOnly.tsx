'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMoundted, setHasMoundted] = useState(false);

  useEffect(() => {
    setHasMoundted(true);
  }, []);

  if (!hasMoundted) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;

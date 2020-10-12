import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
type ContextProps = {
  showSnackbar: (type: 'success' | 'error', message: string) => void;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const SnackbarContext = createContext<ContextProps | undefined>(undefined);

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackType, setSnackType] = React.useState<'success' | 'error'>('success');
  const [snackMessage, setSnackMessage] = React.useState<string>('');
  const DURATION_SNACKBAR = 5000;

  const showSnackbar = useCallback((type, message) => {
    setSnackType(type);
    setSnackbarOpen(true);
    setSnackMessage(message);
  }, []);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar autoHideDuration={DURATION_SNACKBAR} onClose={() => setSnackbarOpen(false)} open={snackbarOpen}>
        <Alert severity={snackType}>{snackMessage}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export default useSnackbar;
export { SnackbarProvider, useSnackbar };

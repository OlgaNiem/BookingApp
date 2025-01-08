import { Toaster } from 'sonner';

const Toast = () => {
  return (
    <Toaster
      position="bottom-right"
      expand={true}
      richColors={true}
    />
  );
};

export default Toast;

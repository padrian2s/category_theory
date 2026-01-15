import { BookProvider } from './contexts/BookContext';
import { ProgressProvider } from './contexts/ProgressContext';
import AppShell from './components/layout/AppShell';

function App() {
  return (
    <BookProvider>
      <ProgressProvider>
        <AppShell />
      </ProgressProvider>
    </BookProvider>
  );
}

export default App;

import { Header } from './components/Header';

export const App: React.FC = () => {
  return (
    <div className="app-shell">
      <Header />
      <div className="main-content-layout"></div>
    </div>
  );
};

export default App;

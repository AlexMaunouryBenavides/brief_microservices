import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './application/store/store';

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div className="p-8 text-2xl font-bold">Voitures Électriques</div>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

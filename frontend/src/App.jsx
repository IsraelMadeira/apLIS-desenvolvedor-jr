import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MedicosPage from "./pages/MedicosPage";
import PacientesPage from "./pages/PacientesPage";
import { useI18n } from "./i18n/useI18n";

function App() {
  const { t } = useI18n();

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="content-shell">
        <header className="topbar">
          <p className="eyebrow">{t("appEyebrow")}</p>
          <h1>{t("appTitle")}</h1>
          <p>{t("appSubtitle")}</p>
        </header>

        <main className="page-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/medicos" replace />} />
            <Route path="/medicos" element={<MedicosPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="*" element={<Navigate to="/medicos" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

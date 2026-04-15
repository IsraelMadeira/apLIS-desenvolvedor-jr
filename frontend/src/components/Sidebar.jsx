import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">LIS DevJR</div>
        <p className="sidebar-tagline">{t("sidebarTagline")}</p>
      </div>

      <nav className="sidebar-nav" aria-label={t("sidebarAria")}> 
        <NavLink
          className={({ isActive }) => `sidebar-link ${isActive ? "is-active" : ""}`}
          to="/medicos"
        >
          {t("menuMedicos")}
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar-link ${isActive ? "is-active" : ""}`}
          to="/pacientes"
        >
          {t("menuPacientes")}
        </NavLink>
      </nav>

      <p className="sidebar-footnote">{t("sidebarFootnote")}</p>
    </aside>
  );
}

export default Sidebar;

import { useEffect, useState } from "react";
import {
  createMedico,
  deleteMedico,
  listMedicos,
  updateMedico
} from "../services/medicosService";
import { useI18n } from "../i18n/useI18n";

const initialForm = {
  nome: "",
  crm: "",
  ufCRM: "",
  especialidade: ""
};

const resolveErrorMessage = (error, fallbackMessage) => {
  if (error?.errors?.length) {
    return `${error.message} ${error.errors.join(" ")}`;
  }

  return error?.message || fallbackMessage;
};

function MedicosPage() {
  const { t } = useI18n();

  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadMedicos = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listMedicos();
      setMedicos(data);
    } catch (loadError) {
      setError(resolveErrorMessage(loadError, t("genericError")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicos();
  }, []);

  const clearForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const validateForm = (payload) => {
    const messages = [];

    if (!payload.nome) {
      messages.push(`Nome: ${t("requiredField")}`);
    }

    if (!payload.crm) {
      messages.push(`CRM: ${t("requiredField")}`);
    }

    if (!payload.ufCRM) {
      messages.push(`UFCRM: ${t("requiredField")}`);
    }

    if (payload.ufCRM.length !== 2) {
      messages.push(t("invalidUfCrm"));
    }

    return messages;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setFeedback("");

    const payload = {
      nome: form.nome.trim(),
      crm: form.crm.trim(),
      ufCRM: form.ufCRM.trim().toUpperCase(),
      especialidade: form.especialidade.trim()
    };

    const validationErrors = validateForm(payload);

    if (validationErrors.length) {
      setError(validationErrors.join(" "));
      return;
    }

    const isEditing = Boolean(editingId);

    try {
      setSubmitting(true);

      if (isEditing) {
        await updateMedico(editingId, payload);
      } else {
        await createMedico(payload);
      }

      await loadMedicos();
      clearForm();
      setFeedback(isEditing ? t("medicoSuccessUpdate") : t("medicoSuccessCreate"));
    } catch (submitError) {
      setError(resolveErrorMessage(submitError, t("genericError")));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (medico) => {
    setEditingId(medico.id);
    setForm({
      nome: medico.nome || "",
      crm: medico.crm || "",
      ufCRM: medico.ufCRM || "",
      especialidade: medico.especialidade || ""
    });
    setFeedback("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("medicoDeleteConfirm"))) {
      return;
    }

    setError("");
    setFeedback("");

    try {
      await deleteMedico(id);
      await loadMedicos();

      if (editingId === id) {
        clearForm();
      }

      setFeedback(t("medicoSuccessDelete"));
    } catch (deleteError) {
      setError(resolveErrorMessage(deleteError, t("genericError")));
    }
  };

  return (
    <section className="page-grid">
      <article className="card">
        <header className="card-header">
          <h2>{t("medicosTitle")}</h2>
          <p>{t("medicosDescription")}</p>
          <h3>{editingId ? t("medicosEditMode") : t("medicosCreateMode")}</h3>
        </header>

        {feedback ? <div className="feedback success">{feedback}</div> : null}
        {!loading && error ? <div className="feedback error">{error}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="medico-nome">{t("medicoNome")}</label>
            <input
              id="medico-nome"
              name="nome"
              value={form.nome}
              onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
              disabled={submitting}
            />
          </div>

          <div className="input-row">
            <div className="field">
              <label htmlFor="medico-crm">{t("medicoCrm")}</label>
              <input
                id="medico-crm"
                name="crm"
                value={form.crm}
                onChange={(event) => setForm((prev) => ({ ...prev, crm: event.target.value }))}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <label htmlFor="medico-ufcrm">{t("medicoUfCrm")}</label>
              <input
                id="medico-ufcrm"
                name="ufCRM"
                maxLength={2}
                value={form.ufCRM}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, ufCRM: event.target.value.toUpperCase() }))
                }
                disabled={submitting}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="medico-especialidade">{t("medicoEspecialidade")}</label>
            <input
              id="medico-especialidade"
              name="especialidade"
              value={form.especialidade}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, especialidade: event.target.value }))
              }
              disabled={submitting}
            />
          </div>

          <div className="button-row">
            <button type="button" className="btn ghost" onClick={clearForm} disabled={submitting}>
              {t("cancel")}
            </button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {editingId ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </article>

      <article className="card">
        <header className="card-header compact">
          <h3>{t("medicosTableTitle")}</h3>
          <button type="button" className="btn ghost" onClick={loadMedicos} disabled={loading}>
            {t("retry")}
          </button>
        </header>

        {loading ? <div className="status loading">{t("loading")}</div> : null}
        {!loading && error ? <div className="status error">{error}</div> : null}
        {!loading && !error && medicos.length === 0 ? (
          <div className="status empty">{t("emptyList")}</div>
        ) : null}

        {!loading && !error && medicos.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("medicoNome")}</th>
                  <th>{t("medicoCrm")}</th>
                  <th>{t("medicoUfCrm")}</th>
                  <th>{t("medicoEspecialidade")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {medicos.map((medico) => (
                  <tr key={medico.id}>
                    <td>{medico.nome}</td>
                    <td>{medico.crm}</td>
                    <td>{medico.ufCRM}</td>
                    <td>{medico.especialidade || "-"}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() => handleEdit(medico)}
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => handleDelete(medico.id)}
                      >
                        {t("remove")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </article>
    </section>
  );
}

export default MedicosPage;

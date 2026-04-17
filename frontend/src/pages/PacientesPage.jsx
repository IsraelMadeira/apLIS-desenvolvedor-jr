import { useEffect, useState } from "react";
import {
  createPaciente,
  deletePaciente,
  listPacientes,
  updatePaciente
} from "../services/pacientesService";
import { useI18n } from "../i18n/useI18n";

const initialForm = {
  nome: "",
  dataNascimento: "",
  carteirinha: "",
  cpf: ""
};

const normalizeCpf = (value) => value.replace(/\D/g, "").slice(0, 11);

const formatCpf = (value, emptyFallback = "") => {
  const digits = normalizeCpf(String(value || ""));

  if (digits.length !== 11) {
    return digits || emptyFallback;
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "-";
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const resolveErrorMessage = (error, fallbackMessage) => {
  if (error?.errors?.length) {
    return `${error.message} ${error.errors.join(" ")}`;
  }

  return error?.message || fallbackMessage;
};

function PacientesPage() {
  const { t } = useI18n();

  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadPacientes = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listPacientes();
      setPacientes(data);
    } catch (loadError) {
      setError(resolveErrorMessage(loadError, t("genericError")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacientes();
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

    if (!payload.dataNascimento) {
      messages.push(`Data de nascimento: ${t("requiredField")}`);
    }

    if (!payload.carteirinha) {
      messages.push(`Carteirinha: ${t("requiredField")}`);
    }

    if (!/^\d{11}$/.test(payload.cpf)) {
      messages.push(t("invalidCpf"));
    }

    return messages;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setFeedback("");

    const payload = {
      nome: form.nome.trim(),
      dataNascimento: form.dataNascimento,
      carteirinha: form.carteirinha.trim(),
      cpf: normalizeCpf(form.cpf)
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
        await updatePaciente(editingId, payload);
      } else {
        await createPaciente(payload);
      }

      await loadPacientes();
      clearForm();
      setFeedback(isEditing ? t("pacienteSuccessUpdate") : t("pacienteSuccessCreate"));
    } catch (submitError) {
      setError(resolveErrorMessage(submitError, t("genericError")));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (paciente) => {
    setEditingId(paciente.id);
    setForm({
      nome: paciente.nome || "",
      dataNascimento: paciente.dataNascimento || "",
      carteirinha: paciente.carteirinha || "",
      cpf: paciente.cpf || ""
    });
    setFeedback("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("pacienteDeleteConfirm"))) {
      return;
    }

    setError("");
    setFeedback("");

    try {
      await deletePaciente(id);
      await loadPacientes();

      if (editingId === id) {
        clearForm();
      }

      setFeedback(t("pacienteSuccessDelete"));
    } catch (deleteError) {
      setError(resolveErrorMessage(deleteError, t("genericError")));
    }
  };

  return (
    <section className="page-grid">
      <article className="card">
        <header className="card-header">
          <h2>{t("pacientesTitle")}</h2>
          <p>{t("pacientesDescription")}</p>
          <h3>{editingId ? t("pacientesEditMode") : t("pacientesCreateMode")}</h3>
        </header>

        {feedback ? <div className="feedback success">{feedback}</div> : null}
        {!loading && error ? <div className="feedback error">{error}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="paciente-nome">{t("pacienteNome")}</label>
            <input
              id="paciente-nome"
              name="nome"
              value={form.nome}
              onChange={(event) => {
                const valor = event.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                setForm((prev) => ({ ...prev, nome: valor }));
              }}
              disabled={submitting}
            />
          </div>

          <div className="input-row">
            <div className="field">
              <label htmlFor="paciente-dataNascimento">{t("pacienteDataNascimento")}</label>
              <input
                id="paciente-dataNascimento"
                name="dataNascimento"
                type="date"
                value={form.dataNascimento}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dataNascimento: event.target.value }))
                }
                disabled={submitting}
              />
            </div>

            <div className="field">
              <label htmlFor="paciente-carteirinha">{t("pacienteCarteirinha")}</label>
              <input
                id="paciente-carteirinha"
                name="carteirinha"
                value={form.carteirinha}
                onChange={(event) => {
                  const valor = event.target.value.replace(/\D/g, "");
                  setForm((prev) => ({ ...prev, carteirinha: valor }));
                }}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="paciente-cpf">{t("pacienteCpf")}</label>
            <input
              id="paciente-cpf"
              name="cpf"
              maxLength={14}
              value={formatCpf(form.cpf, "")}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, cpf: normalizeCpf(event.target.value) }))
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
          <h3>{t("pacientesTableTitle")}</h3>
          <button type="button" className="btn ghost" onClick={loadPacientes} disabled={loading}>
            {t("retry")}
          </button>
        </header>

        {loading ? <div className="status loading">{t("loading")}</div> : null}
        {!loading && error ? <div className="status error">{error}</div> : null}
        {!loading && !error && pacientes.length === 0 ? (
          <div className="status empty">{t("emptyList")}</div>
        ) : null}

        {!loading && !error && pacientes.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("pacienteNome")}</th>
                  <th>{t("pacienteDataNascimento")}</th>
                  <th>{t("pacienteCarteirinha")}</th>
                  <th>{t("pacienteCpf")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.nome}</td>
                    <td>{formatDate(paciente.dataNascimento)}</td>
                    <td>{paciente.carteirinha}</td>
                    <td>{formatCpf(paciente.cpf, "-")}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() => handleEdit(paciente)}
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => handleDelete(paciente.id)}
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

export default PacientesPage;

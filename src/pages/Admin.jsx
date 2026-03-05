import { useState, useEffect, useCallback } from "react";
import { API } from "../lib/api";

const CATEGORIES = [
  { value: "tranquille", label: "Tranquille" },
  { value: "course", label: "Course" },
  { value: "aventure", label: "Aventure" },
];

const emptyForm = {
  type: "ride",
  title: "",
  date: "",
  time: "",
  category: "tranquille",
  location: "",
  description: "",
  link: "",
};

export default function Admin() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rides, setRides] = useState([]);
  const [events, setEvents] = useState([]);

  const isRide = form.type === "ride";

  const fetchData = useCallback(async () => {
    try {
      const [ridesRes, eventsRes] = await Promise.all([
        fetch(`${API}/api/rides`),
        fetch(`${API}/api/events`),
      ]);
      if (ridesRes.ok) setRides(await ridesRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (item, type) => {
    setEditingId(item.id);
    setForm({
      type,
      title: item.title,
      date: item.date,
      time: item.time,
      category: item.category || "tranquille",
      location: type === "ride" ? item.meetingPoint || "" : item.location || "",
      description: item.description || "",
      link: item.link || "",
    });
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ ...emptyForm, type: form.type });
    setStatus(null);
  };

  const handleDelete = async (id, type) => {
    if (!confirm("Supprimer ?")) return;

    const endpoint = type === "ride" ? `/api/rides/${id}` : `/api/events/${id}`;
    try {
      const res = await fetch(`${API}${endpoint}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      fetchData();
      if (editingId === id) handleCancel();
    } catch {
      setStatus({ ok: false, msg: "Erreur lors de la suppression" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const isEdit = !!editingId;
    const baseEndpoint = isRide ? "/api/rides" : "/api/events";
    const endpoint = isEdit ? `${baseEndpoint}/${editingId}` : baseEndpoint;
    const method = isEdit ? "PUT" : "POST";

    const body = isRide
      ? {
          title: form.title,
          date: form.date,
          time: form.time,
          category: form.category,
          meetingPoint: form.location,
          description: form.description,
          link: form.link || undefined,
        }
      : {
          title: form.title,
          date: form.date,
          time: form.time,
          location: form.location,
          description: form.description,
          link: form.link || undefined,
        };

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur serveur");
      }

      const action = isEdit ? "modifié" : "ajouté";
      const label = isRide ? "Sortie" : "Événement";
      setStatus({ ok: true, msg: `${label} ${action} !` });
      setForm({ ...emptyForm, type: form.type });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg bg-panda-800 border border-panda-700 px-4 py-2.5 text-white placeholder-panda-500 focus:border-bamboo-500 focus:outline-none focus:ring-1 focus:ring-bamboo-500 transition";

  const items = (isRide ? rides : events).slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="container max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin</h1>
        <p className="text-panda-400">Gérer les sorties et événements.</p>
      </header>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 flex flex-col gap-5 mb-10">
        {/* Type toggle */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { handleCancel(); setForm({ ...emptyForm, type: "ride" }); }}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              isRide
                ? "bg-bamboo-500 text-white"
                : "bg-panda-800 text-panda-400 border border-panda-700 hover:border-panda-500"
            }`}
          >
            Sortie
          </button>
          <button
            type="button"
            onClick={() => { handleCancel(); setForm({ ...emptyForm, type: "event" }); }}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              !isRide
                ? "bg-bamboo-500 text-white"
                : "bg-panda-800 text-panda-400 border border-panda-700 hover:border-panda-500"
            }`}
          >
            Événement
          </button>
        </div>

        {editingId && (
          <div className="rounded-lg bg-bamboo-500/10 border border-bamboo-500/30 px-4 py-2.5 text-sm text-bamboo-400 flex items-center justify-between">
            <span>Modification en cours</span>
            <button type="button" onClick={handleCancel} className="text-panda-400 hover:text-white transition">
              Annuler
            </button>
          </div>
        )}

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-panda-300 mb-1">Titre *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ex: Zwift - Pleine balle"
            className={inputClass}
          />
        </div>

        {/* Date + Heure */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-panda-300 mb-1">Date *</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-panda-300 mb-1">Heure *</label>
            <input name="time" type="time" value={form.time} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        {/* Catégorie (sorties only) */}
        {isRide && (
          <div>
            <label className="block text-sm font-medium text-panda-300 mb-1">Type *</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Lieu */}
        <div>
          <label className="block text-sm font-medium text-panda-300 mb-1">Lieu</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ex: Gare de Lausanne"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-panda-300 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Détails de la sortie ou événement..."
            className={inputClass + " resize-none"}
          />
        </div>

        {/* Lien */}
        <div>
          <label className="block text-sm font-medium text-panda-300 mb-1">Lien</label>
          <input name="link" value={form.link} onChange={handleChange} type="url" placeholder="https://..." className={inputClass} />
        </div>

        {/* Status */}
        {status && (
          <div className={`rounded-lg px-4 py-3 text-sm ${
            status.ok
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {status.msg}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={submitting} className="btn btn-primary w-full disabled:opacity-50">
          {submitting
            ? "Envoi..."
            : editingId
              ? "Enregistrer les modifications"
              : isRide
                ? "Ajouter la sortie"
                : "Ajouter l'événement"}
        </button>
      </form>

      {/* Liste existante */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          {isRide ? "Sorties" : "Événements"} ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="text-panda-500 text-sm">Aucun élément.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`glass-panel p-4 flex items-center justify-between gap-4 ${
                  editingId === item.id ? "ring-1 ring-bamboo-500" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isRide && item.category && (
                      <span className="text-xs rounded-full bg-panda-700/50 px-2 py-0.5 text-panda-300">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs text-panda-500">{item.date} {item.time}</span>
                  </div>
                  <p className="text-white font-medium truncate">{item.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(item, isRide ? "ride" : "event")}
                    className="text-sm text-panda-400 hover:text-bamboo-400 transition px-2 py-1"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, isRide ? "ride" : "event")}
                    className="text-sm text-panda-500 hover:text-red-400 transition px-2 py-1"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

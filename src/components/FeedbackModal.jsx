import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  MessageSquarePlus,
  Bug,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Scale,
  CheckCircle2,
  Crown,
  Trash2,
  Plus,
  Star,
} from 'lucide-react';

// Endpoint gratuito de envío directo al correo del creador (sin cuentas para los jugadores)
const FEEDBACK_ENDPOINT = 'https://formsubmit.co/ajax/xZATANAZx@gmail.com';
const APP_VERSION = 'v2.2.0';

const CATEGORIES = [
  { id: 'bug', label: '🐛 Reportar Bug / Error', icon: Bug, color: 'border-rose-500/70 bg-rose-950/50 text-rose-200' },
  { id: 'add', label: '💡 Qué Agregar / Idea', icon: Sparkles, color: 'border-amber-500/70 bg-amber-950/50 text-amber-200' },
  { id: 'improve', label: '🔄 Qué Mejorar / Renovar', icon: RefreshCw, color: 'border-sky-500/70 bg-sky-950/50 text-sky-200' },
  { id: 'like', label: '❤️ Qué Me Gustó', icon: ThumbsUp, color: 'border-emerald-500/70 bg-emerald-950/50 text-emerald-200' },
  { id: 'remove', label: '👎 Qué No Gustó / Quitar', icon: ThumbsDown, color: 'border-orange-500/70 bg-orange-950/50 text-orange-200' },
  { id: 'balance', label: '⚖️ Balanceo / Reglas', icon: Scale, color: 'border-purple-500/70 bg-purple-950/50 text-purple-200' },
];

const SECTIONS = [
  'Tablero 2D',
  'Ciudad y Crafteo',
  'Forja de Personajes',
  'Hoja Móvil / QR',
  'Misiones y Viajes',
  'Bestiario',
  'General / Otro',
];

export default function FeedbackModal({ isOpen, onClose, isCreator = false, showToast }) {
  const [tab, setTab] = useState('send'); // 'send' | 'creator'
  const [category, setCategory] = useState('improve');
  const [section, setSection] = useState('Tablero 2D');
  const [senderName, setSenderName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Checklist privado del creador (solo se carga y existe en la PC del creador)
  const [creatorNotes, setCreatorNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCat, setNewNoteCat] = useState('improve');

  useEffect(() => {
    if (!isOpen) return;
    setSentOk(false);
    setErrorMsg('');
    if (isCreator) {
      fetch('/api/creator-notes', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : { notes: [] }))
        .then((d) => setCreatorNotes(Array.isArray(d.notes) ? d.notes : []))
        .catch(() => {});
    }
  }, [isOpen, isCreator]);

  if (!isOpen) return null;

  const selectedCatObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Escribe tu reporte o sugerencia antes de enviar.');
      return;
    }
    setSending(true);
    setErrorMsg('');
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[HeroQuest DM ${APP_VERSION}] ${selectedCatObj.label} — ${section}`,
          _template: 'table',
          _captcha: 'false',
          Categoria: selectedCatObj.label,
          Seccion: section,
          Valoracion: `${rating}/5 estrellas`,
          Jugador: senderName.trim() || 'Aventurero Anónimo',
          Mensaje: message.trim(),
          Version: APP_VERSION,
          Fecha: new Date().toLocaleString('es-MX'),
        }),
      });
      if (!res.ok) throw new Error('Error de red al enviar');
      setSentOk(true);
      setMessage('');
      if (showToast) showToast('✅ ¡Gracias! Tu mensaje fue enviado al creador.');
    } catch {
      setErrorMsg('No se pudo enviar en este momento. Verifica tu conexión a internet e intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSending(true);
    setErrorMsg('');
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[HeroQuest DM] 🧪 Prueba y Activación del Buzón de Sugerencias`,
          _template: 'table',
          _captcha: 'false',
          Mensaje: 'Correo de activación enviado desde tu Panel del Creador. Si es la primera vez, haz clic en "Activate Form" en el correo de FormSubmit para empezar a recibir todos los reportes de tus amigos.',
          Version: APP_VERSION,
        }),
      });
      if (!res.ok) throw new Error('Error');
      if (showToast) showToast('📧 Correo de prueba enviado a tu Gmail. Revisa tu bandeja (o Spam) para activar FormSubmit.');
    } catch {
      if (showToast) showToast('❌ No se pudo enviar el correo de prueba. Revisa tu conexión.');
    } finally {
      setSending(false);
    }
  };

  const saveCreatorNotes = async (nextNotes) => {
    setCreatorNotes(nextNotes);
    try {
      await fetch('/api/creator-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: nextNotes }),
      });
    } catch {
      // ignore
    }
  };

  const handleAddCreatorNote = () => {
    if (!newNoteText.trim()) return;
    const next = [
      {
        id: `n-${Date.now()}`,
        cat: newNoteCat,
        text: newNoteText.trim(),
        done: false,
        date: new Date().toLocaleDateString('es-MX'),
      },
      ...creatorNotes,
    ];
    setNewNoteText('');
    saveCreatorNotes(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-slate-900 border border-amber-500/45 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-black text-amber-300 text-lg flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-amber-400" />
              Sugerencias y Reporte de Bugs
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cuéntale al creador qué te gustó, qué mejorar, qué agregar, qué quitar o si encontraste algún error.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas: SOLO aparece la pestaña del Creador en TU PC (isCreator === true) */}
        {isCreator && (
          <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setTab('send')}
              className={`flex-1 py-2 rounded-lg font-bold cursor-pointer transition ${
                tab === 'send'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              💬 Formulario de Usuarios
            </button>
            <button
              onClick={() => setTab('creator')}
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                tab === 'creator'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" /> Panel del Creador (Solo tú)
            </button>
          </div>
        )}

        {/* ==================== PESTAÑA 1: FORMULARIO PARA TODOS ==================== */}
        {tab === 'send' && (
          <>
            {sentOk ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-display font-black text-emerald-200 text-base">
                  ¡Mensaje enviado correctamente!
                </h4>
                <p className="text-xs text-slate-300">
                  Gracias por ayudar a mejorar HeroQuest: Crónicas del Abismo. El creador recibirá tu reporte directamente en su correo.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setSentOk(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Enviar otro comentario
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Categoría */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    ¿Qué tipo de comentario es?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className={`px-3 py-2 rounded-xl border text-left text-xs font-bold cursor-pointer transition ${
                          category === c.id
                            ? `${c.color} ring-2 ring-amber-400/50`
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sección + Nombre */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Sección del programa
                    </label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-semibold focus:border-amber-400 focus:outline-none"
                    >
                      {SECTIONS.map((s) => (
                        <option key={s} value={s} className="bg-slate-900">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Tu nombre o apodo (opcional)
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Ej: Carlos, El Enano..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Valoración */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-xs text-slate-300 font-semibold">
                    ¿Qué tanto te está gustando la app?
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setRating(n)}
                        className="p-0.5 cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            n <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mensaje */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Cuéntame los detalles
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ej: Me encantó el sistema de viajes, pero estaría genial poder..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 leading-relaxed focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200 font-semibold">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sending ? 'Enviando...' : 'Enviar al Creador'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* ==================== PESTAÑA 2: PANEL PRIVADO DEL CREADOR ==================== */}
        {isCreator && tab === 'creator' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-950/35 border border-purple-500/45 space-y-2 text-xs">
              <div className="font-display font-bold text-purple-200 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                Buzón Privado de Sugerencias (Solo visible en tu PC)
              </div>
              <p className="text-slate-300 leading-relaxed">
                Todo lo que envíen tus amigos desde sus PCs llegará directamente a tu correo{' '}
                <strong className="text-amber-300">xZATANAZx@gmail.com</strong>. Ellos nunca ven esta pestaña ni tu correo.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleSendTestEmail}
                  disabled={sending}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer disabled:opacity-50"
                >
                  🧪 Enviar Correo de Activación / Prueba
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                * Solo la primera vez: pulsa el botón de prueba, abre el correo de FormSubmit en tu Gmail y haz clic en <strong>"Activate Form"</strong>.
              </p>
            </div>

            {/* Lista privada de pendientes / hoja de ruta del creador */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                📝 Tu Lista Privada de Mejoras y Bugs Pendientes
              </div>
              <div className="flex gap-1.5">
                <select
                  value={newNoteCat}
                  onChange={(e) => setNewNoteCat(e.target.value)}
                  className="px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.label.split(' ')[0]}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCreatorNote()}
                  placeholder="Anota un cambio, bug o idea para la próxima actualización..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleAddCreatorNote}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Anotar
                </button>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {creatorNotes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-3 text-center">
                    Aún no tienes notas pendientes. Anota aquí lo que te pidan tus amigos por correo.
                  </p>
                ) : (
                  creatorNotes.map((n) => {
                    const catObj = CATEGORIES.find((c) => c.id === n.cat) || CATEGORIES[0];
                    return (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                          n.done
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                            : 'bg-slate-950/90 border-slate-700/80'
                        }`}
                      >
                        <button
                          onClick={() =>
                            saveCreatorNotes(
                              creatorNotes.map((it) => (it.id === n.id ? { ...it, done: !it.done } : it))
                            )
                          }
                          className="flex items-center gap-2 text-left flex-1 cursor-pointer"
                        >
                          <span className={n.done ? 'text-emerald-400' : 'text-slate-500'}>
                            {n.done ? '✅' : '⬜'}
                          </span>
                          <span className="text-[11px]">{catObj.label.split(' ')[0]}</span>
                          <span className={n.done ? 'line-through text-slate-400' : 'text-slate-100'}>
                            {n.text}
                          </span>
                        </button>
                        <span className="text-[10px] text-slate-500 shrink-0">{n.date}</span>
                        <button
                          onClick={() => saveCreatorNotes(creatorNotes.filter((it) => it.id !== n.id))}
                          className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                          title="Eliminar nota"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, X, Send, Loader2, Activity } from 'lucide-react';
import { userBehaviorService } from '../../services/userBehaviorService';

const AIQuickActions = ({ userId, userName, nlp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [showNlpModal, setShowNlpModal] = useState(false);

  const openNlpModal = () => setShowNlpModal(true);
  const closeNlpModal = () => setShowNlpModal(false);

  // Actions UI fixes (NLP + Analyse)
  const aiActions = [
    {
      icon: Sparkles,
      label: 'Insight NLP',
      action: openNlpModal,
      disabled: !nlp
    }
  ];

  const toggleOpen = async () => {
    if (!isOpen) {
      setLoading(true);
      setIsOpen(true);
      try {
        const data = await userBehaviorService.getEngagementActions(userId);
        setSuggestedActions(data || []);
      } catch (err) {
        console.error('Erreur IA Actions:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="p-2 hover:bg-orange-100 text-orange-500 rounded-full transition-colors"
      >
        <Sparkles size={18} className={loading ? 'animate-pulse' : ''} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-2xl rounded-xl z-50 p-4 animate-in zoom-in duration-200">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h4 className="text-xs font-bold text-gray-800 uppercase">
              IA – {userName}
            </h4>
            <button onClick={() => setIsOpen(false)}>
              <X size={14} />
            </button>
          </div>

          {/* QUICK ACTIONS */}
          <div className="mb-4 space-y-2">
            {aiActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                disabled={action.disabled}
                className={`w-full flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg
                  ${
                    action.disabled
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
          </div>

          {/* IA SUGGESTIONS */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-orange-500" />
            </div>
          ) : suggestedActions.length > 0 ? (
            <div className="space-y-3">
              {suggestedActions.slice(0, 2).map((act, i) => (
                <div
                  key={i}
                  className="text-[11px] bg-slate-50 p-3 rounded-lg border-l-2 border-orange-500"
                >
                  <p className="font-bold text-gray-700">
                    {act.typeRecommandation || 'Action suggérée'}
                  </p>
                  <p className="text-gray-500 my-1">
                    {act.description || 'Relancer l’utilisateur avec du contenu personnalisé.'}
                  </p>
                  <button className="text-orange-600 font-bold flex items-center gap-1 hover:underline">
                    <Send size={10} />
                    Appliquer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-gray-400 italic">
              Aucune action critique détectée.
            </p>
          )}
        </div>
      )}

      {/* NLP MODAL */}
      {showNlpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-slate-800 mb-2">
              🧠 Insight NLP – {userName}
            </h3>

            <p className="text-sm text-slate-600 mb-4">
              {nlp?.summary || 'Analyse NLP indisponible'}
            </p>

            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 mb-1">
                Intentions détectées
              </p>
              <div className="flex flex-wrap gap-2">
                {nlp?.intentions?.map(intent => (
                  <span
                    key={intent}
                    className="px-2 py-1 text-[10px] bg-indigo-50 text-indigo-600 rounded-full font-bold"
                  >
                    {intent}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeNlpModal}
                className="px-4 py-2 text-sm font-bold bg-slate-800 text-white rounded-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuickActions;

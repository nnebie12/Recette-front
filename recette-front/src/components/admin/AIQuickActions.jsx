import React, { useState } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { userBehaviorService } from '../../services/userBehaviorService';

const AIQuickActions = ({ userId, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);

  const toggleOpen = async () => {
    if (!isOpen) {
      setLoading(true);
      setIsOpen(true);
      try {
        const data = await userBehaviorService.getEngagementActions(userId);
        setActions(data || []);
      } catch (err) {
        console.error("Erreur IA Actions:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleOpen} className="p-2 hover:bg-orange-100 text-orange-500 rounded-full transition-colors">
        <Sparkles size={18} className={loading ? 'animate-pulse' : ''} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border shadow-2xl rounded-xl z-50 p-4 animate-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h4 className="text-xs font-bold text-gray-800 uppercase">Stratégie IA : {userName}</h4>
            <button onClick={() => setIsOpen(false)}><X size={14} /></button>
          </div>

          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-orange-500" /></div>
          ) : actions.length > 0 ? (
            <div className="space-y-3">
              {actions.slice(0, 2).map((act, i) => (
                <div key={i} className="text-[11px] bg-slate-50 p-2 rounded border-l-2 border-orange-500">
                  <p className="font-bold text-gray-700">{act.typeRecommandation || "Action Suggérée"}</p>
                  <p className="text-gray-500 my-1">{act.description || "Relancer l'utilisateur avec une recette personnalisée."}</p>
                  <button className="text-orange-600 font-bold flex items-center gap-1 hover:underline">
                    <Send size={10} /> Appliquer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-gray-400 italic">Aucune action critique détectée.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuickActions;
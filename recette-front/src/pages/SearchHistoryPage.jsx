import React, { useState, useEffect, useContext } from 'react';
import { Search, Clock, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { searchHistoryService } from '../services/searchHistoryService';

const SearchHistoryPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser) {
      searchHistoryService.getUserHistory(currentUser.id).then(setHistory);
    }
  }, [currentUser]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="text-orange-500" /> Mon Historique de Recherche
      </h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <div key={idx} className="p-4 border-b flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">"{item.terme}"</p>
                <p className="text-xs text-gray-400">{new Date(item.dateRecherche).toLocaleDateString()}</p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                {item.contexteRecherche}
              </span>
            </div>
          ))
        ) : (
          <p className="p-8 text-center text-gray-500">Aucune recherche enregistrée.</p>
        )}
      </div>
    </div>
  );
};

export default SearchHistoryPage;
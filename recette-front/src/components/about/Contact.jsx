import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contactez-nous</h2>
            <p className="text-gray-600 mb-8">
              Une question sur une recette ? Un problème technique ? 
              Notre équipe vous répond sous 24h.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><Mail /></div>
                <span>support@recipeapp.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><Phone /></div>
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><MapPin /></div>
                <span>75000 Paris, France</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <form className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                <span>Envoyer le message</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;
import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Team = () => {
  const members = [
    { name: "Marc Dupont", role: "Chef Fondateur", bio: "Ancien chef étoilé reconverti dans la tech." },
    { name: "Sophie Martin", role: "Développeuse Fullstack", bio: "Spécialiste React et passionnée de pâtisserie." },
    { name: "Léa Bernard", role: "Expert Nutrition", bio: "Veille à l'équilibre nutritionnel de nos suggestions IA." }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Rencontrez l'équipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm overflow-hidden group">
              <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center text-orange-500 text-2xl font-bold">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-orange-600 font-medium mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm mb-6">{member.bio}</p>
              <div className="flex justify-center space-x-4">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                <Github className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer" />
                <Mail className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
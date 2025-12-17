import { ChefHat, Heart, Star, Users } from 'lucide-react';

const AboutUs = () => {
  const values = [
    { icon: <Users className="w-6 h-6" />, title: "Communauté", desc: "Une plateforme d'échange pour tous les passionnés de cuisine." },
    { icon: <Heart className="w-6 h-6" />, title: "Passion", desc: "Nous croyons que la cuisine est avant tout un acte de partage." },
    { icon: <Star className="w-6 h-6" />, title: "Qualité", desc: "Des recettes testées et approuvées par nos membres." }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Section Histoire */}
    <section className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Notre Histoire</h2>
        <div className="mt-2 h-1 w-20 bg-orange-500 mx-auto rounded"></div>
        </div>
        
        <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-orange-500 first-letter:mr-3 first-letter:float-left">
            Tout a commencé par une observation simple : la cuisine est l'un des domaines les plus personnels qui soit. 
            Pourtant, malgré l'essor de la cuisine connectée, nous avons réalisé qu'il manquait l'essentiel : 
            <span className="text-gray-900 font-medium"> une véritable personnalisation.</span>
        </p>

        <p>
            Nous avons constaté que les applications actuelles se contentaient d’afficher des recettes 
            sans exploiter les données pour s’adapter aux besoins réels de chacun. Face à cette lacune, 
            nous avons voulu repenser l'expérience culinaire digitale.
        </p>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-8 italic text-gray-700">
            "Comment concevoir un système qui ne se contente pas d'afficher des données, mais qui soit 
            capable de comprendre les préférences utilisateur pour proposer des recommandations uniques ?"
        </div>

        <p>
            C'est cette question qui a donné naissance à RecipeApp. Notre projet intègre aujourd'hui 
            des mécanismes intelligents de gestion de données pour transformer chaque recherche en une 
            découverte pertinente et personnalisée.
        </p>
        </div>
    </div>
    </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {values.map((val, idx) => (
            <div key={idx} className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 flex justify-center mb-4">{val.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{val.title}</h3>
              <p className="text-gray-600">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
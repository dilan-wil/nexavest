export default function AboutUs() {
  return (
    <div className="w-full max-w-[1200px] bg-white">
      <header className="relative py-12 md:py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3')] bg-cover bg-center" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">NexaVest Pro</h1>
          <p className="text-lg md:text-xl">Pionnier de l'Avenir de l'Investissement en Actifs Numériques</p>
        </div>
      </header>

      <section className="py-12 md:py-16 px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Qui Sommes-Nous</h2>
            <p className="text-base md:text-lg">
              NexaVest Pro est une société leader d'investissement en cryptomonnaies dédiée à fournir des solutions de
              gestion d'actifs numériques de qualité institutionnelle. <b>Fondée Mercredi le 5 février 2025</b>, nous avons constamment offert des
              rendements exceptionnels tout en maintenant les plus hauts standards de sécurité et de conformité. Notre
              équipe d'experts combine une connaissance approfondie du marché avec une technologie de pointe pour
              maximiser le potentiel d'investissement.
            </p>
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8">
              <div className="text-center">
                <span className="text-2xl md:text-4xl font-bold text-blue-600">2,5 Mrd€+</span>
                <p className="mt-2 text-sm md:text-base">Actifs Sous Gestion</p>
              </div>
              <div className="text-center">
                <span className="text-2xl md:text-4xl font-bold text-blue-600">50K+</span>
                <p className="mt-2 text-sm md:text-base">Investisseurs Actifs</p>
              </div>
              <div className="text-center">
                <span className="text-2xl md:text-4xl font-bold text-blue-600">24/7</span>
                <p className="mt-2 text-sm md:text-base">Surveillance du Marché</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Nos Valeurs Fondamentales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-blue-600">security</span>
            <h3 className="text-xl font-bold mt-4 mb-2">Sécurité Avant Tout</h3>
            <p className="text-sm md:text-base">
              Protocoles de sécurité de pointe et protection multicouche pour vos investissements. Nous utilisons des
              solutions de cryptage et de stockage à froid à la pointe de la technologie.
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-blue-600">trending_up</span>
            <h3 className="text-xl font-bold mt-4 mb-2">Axé sur la Performance</h3>
            <p className="text-sm md:text-base">
              Stratégies basées sur les données optimisées pour des rendements maximaux avec un risque géré. Nos
              analyses alimentées par l'IA assurent une performance optimale du portefeuille.
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-blue-600">verified_user</span>
            <h3 className="text-xl font-bold mt-4 mb-2">Conformité Réglementaire</h3>
            <p className="text-sm md:text-base">
              Conformité totale avec les cadres et normes réglementaires mondiaux. Agréé et réglementé dans les
              principales juridictions du monde entier.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

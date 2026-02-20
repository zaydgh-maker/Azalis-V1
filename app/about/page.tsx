import Section from '@/components/ui/Section';

export const metadata = {
  title: 'À propos - AZALIS',
  description: 'Découvrez l&apos;histoire et les valeurs d&apos;AZALIS',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section background="white" padding="lg">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-azalis-green">
            À propos d&apos;AZALIS
          </h1>
          <p className="text-lg md:text-xl text-azalis-black/70 max-w-2xl mx-auto">
            Une vision du naturel, maîtrisée et authentique
          </p>
        </div>
      </Section>

      {/* Contenu */}
      <Section background="beige" padding="lg">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-azalis-green">
              Notre philosophie
            </h2>
            <p className="text-base md:text-lg text-azalis-black/70 leading-relaxed">
              AZALIS incarne une approche réfléchie et rigoureuse du naturel. 
              Nous croyons que les meilleurs produits naissent d&apos;une sélection 
              minutieuse et d&apos;un contrôle exigeant de la qualité.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-azalis-green">
              Nos valeurs
            </h2>
            <ul className="space-y-3 text-base md:text-lg text-azalis-black/70">
              <li className="flex items-start gap-3">
                <span className="text-azalis-green mt-1">•</span>
                <span>Authenticité : Des produits naturels, sans compromis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-azalis-green mt-1">•</span>
                <span>Transparence : Une traçabilité complète de nos produits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-azalis-green mt-1">•</span>
                <span>Excellence : Une sélection rigoureuse et exigeante</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}

import Link from 'next/link';
import Container from '@/components/Container';

export const metadata = {
  title: 'À propos - AZALIS',
  description: "Découvrez l'histoire et les valeurs d'AZALIS",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-12 bg-[#F5F0E8]">
        <Container size="lg">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-4xl md:text-5xl text-[#3D5A47] max-w-3xl mx-auto">
              Une marque née d&apos;une nécessité
            </h1>
            <p className="text-lg text-gray-500 italic max-w-2xl mx-auto">
              Le naturel ne suffit pas. Il faut aussi l&apos;exiger.
            </p>
          </div>
        </Container>
      </section>

      {/* Histoire */}
      <section className="pt-8 pb-12 bg-[#F5F0E8]">
        <Container size="md">
          <div className="max-w-2xl mx-auto space-y-5 text-[#2E2E2E]/80 leading-loose text-base md:text-lg text-justify">
            <p>
              Azalis est née de mon combat personnel. Atteinte d&apos;une maladie auto-immune, j&apos;ai dû repenser entièrement ma relation aux cosmétiques. Les additifs, les conservateurs, les formules opaques — tout devait disparaître.
            </p>
            <p>
              En me tournant vers le naturel et l&apos;artisanal, je me suis heurtée à une autre réalité : l&apos;absence de contrôle, les fraudes, les compositions douteuses. Le naturel sans rigueur ne suffisait pas.
            </p>
            <p>
              Ma solution ? Créer moi-même. Passer par un laboratoire agréé, formuler avec soin, exiger la transparence totale. Azalis est née de cette exigence — pour moi, et pour toutes celles qui méritent mieux.
            </p>
            <p>
              Je m&apos;adresse à toutes celles et ceux qui refusent de choisir entre efficacité et naturel — peaux sensibles, exigeantes, ou simplement conscientes de ce qu&apos;elles appliquent.
            </p>
            <p className="text-right italic">
              — Imane, fondatrice d&apos;Azalis
            </p>
          </div>
        </Container>
      </section>

      {/* Valeurs */}
      <section className="py-12 bg-[#F5F0E8] border-t border-[#E8E2D9]">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <h3 className="font-serif text-xl text-[#3D5A47] font-medium">
                Transparence
              </h3>
              <p className="text-sm text-[#2E2E2E]/70 leading-relaxed">
                Chaque ingrédient que je retiens a une raison d&apos;être
              </p>
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-serif text-xl text-[#3D5A47] font-medium">
                Rigueur
              </h3>
              <p className="text-sm text-[#2E2E2E]/70 leading-relaxed">
                Je formule en laboratoire agréé, je teste et je valide chaque soin
              </p>
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-serif text-xl text-[#3D5A47] font-medium">
                Nature maîtrisée
              </h3>
              <p className="text-sm text-[#2E2E2E]/70 leading-relaxed">
                Je vise 98% de naturalité, sans aucun compromis sur la sécurité
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#3D5A47]">
        <Container size="lg">
          <div className="text-center space-y-4">
            <Link
              href="/produits"
              className="inline-block px-10 py-4 border border-white text-white font-serif font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Découvrir nos sérums
            </Link>
            <p className="text-xs text-white opacity-60">
              Livraison offerte dès 300 DH · Production limitée
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

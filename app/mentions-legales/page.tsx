import Container from '@/components/Container';

export const metadata = {
  title: 'Mentions légales - AZALIS',
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-12 md:py-20 bg-azalis-white">
      <Container size="md">
        <div className="max-w-3xl mx-auto space-y-8 text-[#2E2E2E]/80">
          <header className="space-y-3 text-center md:text-left">
            <h1 className="font-serif text-3xl md:text-4xl text-azalis-green">
              Mentions Légales
            </h1>
            <p className="text-sm text-azalis-black/60">
              Informations légales relatives à la marque AZALIS.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Éditeur</h2>
            <p className="text-sm leading-relaxed">
              AZALIS, Rabat Maroc · Tél&nbsp;: +212 778 987 933 · Site&nbsp;: azalis.ma · Instagram&nbsp;: @azalis.care
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Protection du consommateur</h2>
            <p className="text-sm leading-relaxed">
              AZALIS s&apos;engage à respecter la loi n°31-08 édictant des mesures de protection du consommateur,
              notamment en matière d&apos;information, de transparence et de droit de rétractation lorsque celui-ci
              est applicable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Propriété intellectuelle</h2>
            <p className="text-sm leading-relaxed">
              L&apos;ensemble des contenus du site (textes, visuels, identité graphique, marque AZALIS, etc.) est
              protégé par la loi n°2-00 relative aux droits d&apos;auteur et droits voisins. Toute reproduction,
              représentation ou utilisation non autorisée est strictement interdite.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Responsabilité</h2>
            <p className="text-sm leading-relaxed">
              Les informations fournies sur le site azalis.ma le sont à titre indicatif. Malgré le soin apporté à leur
              mise à jour, AZALIS ne peut être tenue responsable d&apos;une éventuelle inexactitude ou omission.
              L&apos;utilisation des produits doit se faire conformément aux recommandations figurant sur les
              emballages et fiches produits.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}


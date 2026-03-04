import Container from '@/components/Container';

export const metadata = {
  title: 'Politique de confidentialité - AZALIS',
};

export default function ConfidentialitePage() {
  return (
    <section className="py-12 md:py-20 bg-azalis-white">
      <Container size="md">
        <div className="max-w-3xl mx-auto space-y-8 text-[#2E2E2E]/80">
          <header className="space-y-3 text-center md:text-left">
            <h1 className="font-serif text-3xl md:text-4xl text-azalis-green">
              Politique de Confidentialité
            </h1>
            <p className="text-sm text-azalis-black/60">
              Gestion de vos données personnelles dans le cadre des commandes AZALIS.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Cadre légal</h2>
            <p className="text-sm leading-relaxed">
              AZALIS traite les données personnelles conformément à la loi n°09-08 relative à la protection des
              personnes physiques à l&apos;égard du traitement des données à caractère personnel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Données collectées</h2>
            <p className="text-sm leading-relaxed">
              Dans le cadre de la commande, les données suivantes peuvent être collectées&nbsp;:
            </p>
            <ul className="list-disc list-inside text-sm leading-relaxed">
              <li>Nom et prénom</li>
              <li>Numéro de téléphone</li>
              <li>Adresse de livraison (adresse postale, ville, code postal)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Durée de conservation</h2>
            <p className="text-sm leading-relaxed">
              Les données liées aux commandes sont conservées pendant une durée maximale de 12 mois, puis supprimées ou
              anonymisées. Elles ne sont jamais revendues à des tiers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Droit d&apos;accès et de rectification</h2>
            <p className="text-sm leading-relaxed">
              Vous pouvez exercer vos droits d&apos;accès, de rectification ou de suppression de vos données en nous
              contactant via WhatsApp au +212 778 987 933.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Paiement</h2>
            <p className="text-sm leading-relaxed">
              Aucun paiement en ligne n&apos;est effectué sur le site azalis.ma. Le paiement se fait uniquement en
              espèces à la réception de la commande.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}


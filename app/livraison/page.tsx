import Container from '@/components/Container';

export const metadata = {
  title: 'Livraison et Retours - AZALIS',
};

export default function LivraisonPage() {
  return (
    <section className="py-12 md:py-20 bg-azalis-white">
      <Container size="md">
        <div className="max-w-3xl mx-auto space-y-8 text-[#2E2E2E]/80">
          <header className="space-y-3 text-center md:text-left">
            <h1 className="font-serif text-3xl md:text-4xl text-azalis-green">
              Livraison et Retours
            </h1>
            <p className="text-sm text-azalis-black/60">
              Informations sur les délais, frais de livraison et conditions de retour.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Prestataire et délais</h2>
            <p className="text-sm leading-relaxed">
              La livraison est assurée par un prestataire partenaire. Les délais peuvent varier en fonction de la ville
              et de la zone de livraison.
            </p>
            <ul className="list-disc list-inside text-sm leading-relaxed">
              <li>Grandes villes&nbsp;: 24–48h ouvrées</li>
              <li>Autres villes&nbsp;: 48–72h ouvrées</li>
              <li>Zones éloignées&nbsp;: 3–5 jours ouvrés</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Frais de livraison</h2>
            <p className="text-sm leading-relaxed">
              Les frais de livraison sont variables selon la ville et seront précisés lors de la confirmation de
              commande. Ils sont offerts dès 300&nbsp;DH d&apos;achat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Mode de paiement</h2>
            <p className="text-sm leading-relaxed">
              Le paiement se fait exclusivement en espèces à la réception de la commande auprès du livreur.
              Le paiement par carte bancaire sera disponible prochainement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-azalis-green">Retours</h2>
            <p className="text-sm leading-relaxed">
              En cas de produit endommagé ou d&apos;erreur de préparation, vous disposez de 48h après la livraison pour
              demander un retour ou un échange.
            </p>
            <p className="text-sm leading-relaxed">
              La demande s&apos;effectue via WhatsApp en contactant le +212 778 987 933 avec une photo du produit et
              votre numéro de commande.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}


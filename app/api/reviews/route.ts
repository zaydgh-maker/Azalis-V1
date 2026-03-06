import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, name, city, rating, comment } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Le nom est requis.' }, { status: 400 });
    }
    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return NextResponse.json({ error: 'Le commentaire est requis.' }, { status: 400 });
    }
    if (!product_id) {
      return NextResponse.json({ error: 'Le product_id est requis.' }, { status: 400 });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: 'La note doit être un entier entre 1 et 5.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id,
        name: name.trim(),
        city: city?.trim() || null,
        rating,
        comment: comment.trim(),
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert review error:', error);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement de l\'avis.' }, { status: 500 });
    }

    return NextResponse.json({ review: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
}

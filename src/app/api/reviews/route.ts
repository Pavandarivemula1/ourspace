import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { submitReview } from '@/services/collaborations/service';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { outcomeId, revieweeId, dimension, rating, content, wasPunctual, wouldRecommend } = await req.json();

    if (!dimension || !rating || !content) {
      return NextResponse.json({ error: 'Dimension, rating, and feedback content are required' }, { status: 400 });
    }

    const review = await submitReview({
      outcomeId,
      reviewerId: user.id,
      revieweeId,
      dimension: dimension.toUpperCase(),
      rating: parseInt(rating, 10),
      content,
      wasPunctual: wasPunctual ?? true,
      wouldRecommend: wouldRecommend ?? true,
    });

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted and multi-dimensional reputation scores recalculated!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

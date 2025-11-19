import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const topScores = await prisma.gameScore.findMany({
      take: Math.min(limit, 100),
      skip: offset,
      orderBy: {
        score: 'desc',
      },
      select: {
        id: true,
        playerName: true,
        score: true,
        coveredHay: true,
        createdAt: true,
      },
    });

    const totalCount = await prisma.gameScore.count();

    return NextResponse.json({
      success: true,
      leaderboard: topScores,
      total: totalCount,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

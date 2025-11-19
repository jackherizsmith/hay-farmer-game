import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { playerName, score, coveredHay, gameplayData, weatherHistory, actions, duration } = body;

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    if (typeof coveredHay !== 'number' || coveredHay < 0) {
      return NextResponse.json({ error: 'Invalid covered hay count' }, { status: 400 });
    }

    const gameScore = await prisma.gameScore.create({
      data: {
        playerName: playerName || null,
        score,
        coveredHay,
        gameplayData: gameplayData || null,
      },
    });

    if (weatherHistory && actions) {
      await prisma.gameSession.create({
        data: {
          playerName: playerName || null,
          finalScore: score,
          coveredHay,
          uncoveredHay: gameplayData?.uncoveredHay || 0,
          weatherHistory,
          actions,
          duration: duration || 60,
        },
      });
    }

    return NextResponse.json({
      success: true,
      id: gameScore.id,
      score: gameScore.score,
    });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const recentScores = await prisma.gameScore.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        playerName: true,
        score: true,
        coveredHay: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      scores: recentScores,
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}

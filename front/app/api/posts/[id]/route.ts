import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  deletePost,
  getPostById,
  updatePost,
} from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const post =
      await getPostById(id);

    if (!post) {
      return NextResponse.json(
        {
          error:
            'Contenu introuvable.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      post,
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error(
      '[API posts/:id GET]',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur de lecture.',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    if (
      !body ||
      typeof body !== 'object'
    ) {
      return NextResponse.json(
        {
          error:
            'Données invalides.',
        },
        { status: 400 }
      );
    }

    const existing =
      await getPostById(id);

    if (!existing) {
      return NextResponse.json(
        {
          error:
            'Contenu introuvable.',
        },
        { status: 404 }
      );
    }

    const updated =
      await updatePost(
        id,
        body
      );

    return NextResponse.json(
      updated
    );
  } catch (error) {
    console.error(
      '[API posts/:id PUT]',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Impossible de modifier le contenu.',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return PUT(
    request,
    context
  );
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const existing =
      await getPostById(id);

    if (!existing) {
      return NextResponse.json(
        {
          error:
            'Contenu introuvable.',
        },
        { status: 404 }
      );
    }

    await deletePost(id);

    return NextResponse.json({
      success: true,
      id,
    });
  } catch (error) {
    console.error(
      '[API posts/:id DELETE]',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Impossible de supprimer le contenu.',
      },
      { status: 500 }
    );
  }
}

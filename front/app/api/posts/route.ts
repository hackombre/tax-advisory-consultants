import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  createPost,
  getPosts,
  type PostType,
} from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const VALID_TYPES: PostType[] = [
  'publication',
  'actualite',
  'document',
];

export async function GET(
  request: NextRequest
) {
  try {
    const type =
      request.nextUrl.searchParams.get(
        'type'
      ) as PostType | null;

    const posts = await getPosts();

    const filtered =
      type && VALID_TYPES.includes(type)
        ? posts.filter(
            (post) => post.type === type
          )
        : posts;

    return NextResponse.json(
      filtered,
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error(
      '[API posts GET]',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur de lecture des publications.',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== 'object'
    ) {
      return NextResponse.json(
        {
          error:
            'Données de publication invalides.',
        },
        { status: 400 }
      );
    }

    if (
      !VALID_TYPES.includes(
        body.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Le type doit être publication, actualite ou document.',
        },
        { status: 400 }
      );
    }

    if (
      !body.title ||
      typeof body.title !== 'string'
    ) {
      return NextResponse.json(
        {
          error:
            'Le titre est obligatoire.',
        },
        { status: 400 }
      );
    }

    const post = await createPost({
      ...body,

      title: body.title.trim(),

      type: body.type as PostType,
    });

    return NextResponse.json(
      post,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      '[API posts POST]',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Impossible de créer la publication.',
      },
      { status: 500 }
    );
  }
}

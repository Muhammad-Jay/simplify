import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = await params;

    try {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('components_slug')
            .select('*')
            .match('slug'=== slug)
            // .maybeSingle();

        if (error) {
            console.error('[Supabase Error]:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('[Server Error]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

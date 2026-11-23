import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect_to') || 'http://localhost:3000';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return NextResponse.json({
      configured: false,
      enabled: false,
      message: 'Supabase URL no configurada',
    });
  }

  const projectId = supabaseUrl.replace('https://', '').split('.')[0];
  const callbackUrl = `${supabaseUrl}/auth/v1/callback`;
  const authorizeUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

  try {
    const checkRes = await fetch(authorizeUrl, {
      method: 'GET',
      redirect: 'manual',
    });

    // Check if Supabase returned 400 validation error (provider disabled)
    if (checkRes.status === 400) {
      const errorData = await checkRes.json().catch(() => null);
      return NextResponse.json({
        configured: true,
        enabled: false,
        reason: 'provider_not_enabled',
        projectId,
        callbackUrl,
        providerSettingsUrl: `https://supabase.com/dashboard/project/${projectId}/auth/providers`,
        rawError: errorData?.msg || 'Unsupported provider: provider is not enabled',
      });
    }

    // If Supabase returned 302/303 redirecting to accounts.google.com
    const location = checkRes.headers.get('location');
    return NextResponse.json({
      configured: true,
      enabled: true,
      authorizeUrl: location || authorizeUrl,
      projectId,
      callbackUrl,
    });
  } catch (err: any) {
    console.error('Google check error:', err);
    return NextResponse.json({
      configured: true,
      enabled: false,
      reason: 'provider_not_enabled',
      projectId,
      callbackUrl,
      providerSettingsUrl: `https://supabase.com/dashboard/project/${projectId}/auth/providers`,
      message: err?.message || 'Error al conectar con Supabase Auth',
    });
  }
}

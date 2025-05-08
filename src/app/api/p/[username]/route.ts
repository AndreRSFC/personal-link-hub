import { supabase } from '@/lib/supabase'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { username } = params

    if (!username) {
      return NextResponse.json(
        { error: 'Username não especificado' },
        { status: 400 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, name, description, profile_image_url')
      .eq('username', username)
      .single()

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        )
      }

      console.error('Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuário' },
        { status: 500 }
      )
    }

    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, title, url, image_url')
      .eq('user_id', profile.id)
      .eq('is_visible', true)
      .order('order_position', { ascending: true })

    if (linksError) {
      console.error('Erro ao buscar links:', linksError)
      return NextResponse.json(
        { error: 'Erro ao buscar links' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      profile,
      links: links || [],
    })
  } catch (error) {
    console.error('Erro ao processar solicitação:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

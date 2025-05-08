import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getServerSession } from 'next-auth/next'
import { type NextRequest, NextResponse } from 'next/server'

interface ProfileUpdateRequest {
  profile: {
    name?: string
    description?: string
    username?: string
  }
  links: Array<{
    title: string
    url: string
    is_visible?: boolean
    image_url?: string | null
  }>
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { error: 'Erro ao buscar dados do usuário' },
        { status: 500 }
      )
    }

    const { data: links, error: linksError } = await supabaseAdmin
      .from('links')
      .select('*')
      .eq('user_id', session.user.id)
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { profile, links }: ProfileUpdateRequest = await request.json()

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        name: profile.name,
        description: profile.description,
        username: profile.username,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)

    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError)
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil' },
        { status: 500 }
      )
    }

    const { error: deleteError } = await supabaseAdmin
      .from('links')
      .delete()
      .eq('user_id', session.user.id)

    if (deleteError) {
      console.error('Erro ao deletar links existentes:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao atualizar links' },
        { status: 500 }
      )
    }

    if (links && links.length > 0) {
      const linksToInsert = links.map((link, index) => ({
        user_id: session.user.id,
        title: link.title,
        url: link.url,
        is_visible: link.is_visible !== undefined ? link.is_visible : true,
        image_url: link.image_url || null,
        order_position: index,
      }))

      const { error: insertError } = await supabaseAdmin
        .from('links')
        .insert(linksToInsert)

      if (insertError) {
        console.error('Erro ao inserir novos links:', insertError)
        return NextResponse.json(
          { error: 'Erro ao adicionar novos links' },
          { status: 500 }
        )
      }
    }

    const { data: updatedProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    const { data: updatedLinks } = await supabaseAdmin
      .from('links')
      .select('*')
      .eq('user_id', session.user.id)
      .order('order_position', { ascending: true })

    return NextResponse.json({
      profile: updatedProfile,
      links: updatedLinks || [],
    })
  } catch (error) {
    console.error('Erro ao processar solicitação:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

import { supabaseAdmin } from '@/lib/supabase'
import { type NextRequest, NextResponse } from 'next/server'

interface SignupRequest {
  email: string
  password: string
  username: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, username }: SignupRequest = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Erro ao verificar username:', checkError)
      return NextResponse.json(
        { error: 'Erro ao verificar disponibilidade do username' },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username já está em uso' },
        { status: 400 }
      )
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError) {
      console.error('Erro ao criar usuário:', authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ username })
      .eq('id', authData.user.id)

    if (updateError) {
      console.error('Erro ao atualizar username:', updateError)
      return NextResponse.json(
        { error: 'Erro ao configurar o perfil do usuário' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao processar registro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

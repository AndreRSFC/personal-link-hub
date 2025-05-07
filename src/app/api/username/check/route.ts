// app/api/username/check/route.ts
import { supabase } from '@/lib/supabase'
import { type NextRequest, NextResponse } from 'next/server'

interface UsernameCheckRequest {
  username: string
}

export async function POST(request: NextRequest) {
  try {
    const { username }: UsernameCheckRequest = await request.json()

    if (!username || username.length < 3) {
      return NextResponse.json(
        {
          available: false,
          message: 'Username deve ter pelo menos 3 caracteres',
        },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        {
          available: false,
          message: 'Username pode conter apenas letras, números, _ e -',
        },
        { status: 400 }
      )
    }

    const { data: existingUser, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar username:', error)
      return NextResponse.json(
        { error: 'Erro ao verificar disponibilidade do username' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? 'Username já está em uso' : 'Username disponível',
    })
  } catch (error) {
    console.error('Erro ao verificar username:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar disponibilidade do username' },
      { status: 500 }
    )
  }
}

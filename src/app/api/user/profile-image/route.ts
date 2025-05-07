import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getServerSession } from 'next-auth/next'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas imagens são permitidas' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExtension = file.name.split('.').pop()
    const fileName = `${session.user.id}/${uuidv4()}.${fileExtension}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('profile-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao processar o upload da imagem' },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('profile-images').getPublicUrl(fileName)

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        profile_image_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)

    if (updateError) {
      console.error('Erro ao atualizar imagem de perfil:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar imagem de perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl: publicUrl })
  } catch (error) {
    console.error('Erro ao processar solicitação:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

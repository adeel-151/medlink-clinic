import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        doctor: true
      }
    })

    if (!record) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error fetching medical record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { diagnoses, treatments, notes } = body

    const record = await prisma.medicalRecord.update({
      where: { id: params.id },
      data: {
        diagnoses,
        treatments,
        notes
      }
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error updating medical record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.medicalRecord.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Medical record deleted successfully' })
  } catch (error) {
    console.error('Error deleting medical record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

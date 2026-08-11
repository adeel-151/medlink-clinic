import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, context: any) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: (await context.params).id },
      include: {
        patient: true,
        doctor: true
      }
    })

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    return NextResponse.json(prescription)
  } catch (error) {
    console.error('Error fetching prescription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json()
    const { medicines, dosage, instructions, duration } = body

    const prescription = await prisma.prescription.update({
      where: { id: (await context.params).id },
      data: {
        medicines,
        dosage,
        instructions,
        duration
      }
    })

    return NextResponse.json(prescription)
  } catch (error) {
    console.error('Error updating prescription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await prisma.prescription.delete({
      where: { id: (await context.params).id }
    })

    return NextResponse.json({ message: 'Prescription deleted successfully' })
  } catch (error) {
    console.error('Error deleting prescription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

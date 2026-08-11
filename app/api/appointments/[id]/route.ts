import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, context: any) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: (await context.params).id },
      include: {
        patient: true,
        doctor: true,
        payment: true
      }
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json()
    const { datetime, status, reason } = body

    const appointment = await prisma.appointment.update({
      where: { id: (await context.params).id },
      data: {
        datetime: datetime ? new Date(datetime) : undefined,
        status,
        reason
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await prisma.appointment.delete({
      where: { id: (await context.params).id }
    })

    return NextResponse.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

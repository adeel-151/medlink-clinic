import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, doctorId, datetime, reason } = body

    if (!patientId || !doctorId || !datetime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        datetime: new Date(datetime),
        reason,
        status: 'SCHEDULED'
      }
    })

    return NextResponse.json({
      id: appointment.id,
      status: appointment.status,
      message: 'Appointment booked successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const doctorId = searchParams.get('doctorId')

    const where: any = {}
    if (patientId) where.patientId = patientId
    if (doctorId) where.doctorId = doctorId

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: true,
        patient: true
      },
      orderBy: {
        datetime: 'asc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

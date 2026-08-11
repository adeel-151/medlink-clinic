import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, context: any) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: (await context.params).id },
      include: {
        user: {
          select: { email: true }
        },
        appointments: true,
        medicalRecords: true,
        prescriptions: true
      }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, dateOfBirth, address } = body

    const patient = await prisma.patient.update({
      where: { id: (await context.params).id },
      data: {
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address
      }
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await prisma.patient.delete({
      where: { id: (await context.params).id }
    })

    return NextResponse.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

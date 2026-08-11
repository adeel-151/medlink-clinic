import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, context: any) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: (await context.params).id },
      include: {
        user: { select: { email: true } },
        appointments: true,
        reviews: true
      }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const body = await request.json()
    const { firstName, lastName, specialty, experienceYears, bio } = body

    const doctor = await prisma.doctor.update({
      where: { id: (await context.params).id },
      data: {
        firstName,
        lastName,
        specialty,
        experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
        bio
      }
    })

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Error updating doctor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await prisma.doctor.delete({
      where: { id: (await context.params).id }
    })

    return NextResponse.json({ message: 'Doctor deleted successfully' })
  } catch (error) {
    console.error('Error deleting doctor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

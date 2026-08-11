import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const doctorId = searchParams.get('doctorId')

    const where: any = {}
    if (patientId) where.patientId = patientId
    if (doctorId) where.doctorId = doctorId

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        doctor: true,
        patient: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(prescriptions)
  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, doctorId, medicines, dosage, instructions, duration } = body

    if (!patientId || !doctorId || !medicines || !dosage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId,
        medicines,
        dosage,
        instructions,
        duration
      }
    })

    return NextResponse.json(prescription, { status: 201 })
  } catch (error) {
    console.error('Error creating prescription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const records = await prisma.medicalRecord.findMany({
      where,
      include: {
        doctor: true,
        patient: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, doctorId, diagnoses, treatments, notes } = body

    if (!patientId || !doctorId || !diagnoses || !treatments) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        doctorId,
        diagnoses,
        treatments,
        notes
      }
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Error creating medical record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

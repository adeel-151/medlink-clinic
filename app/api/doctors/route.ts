import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const search = searchParams.get('search')

    const where: any = {}

    if (specialty) {
      where.specialty = {
        contains: specialty,
        mode: 'insensitive',
      }
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    })

    return NextResponse.json(doctors)
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, firstName, lastName, specialty, experienceYears, bio } = body

    if (!userId || !firstName || !lastName || !specialty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const doctor = await prisma.doctor.create({
      data: {
        userId,
        firstName,
        lastName,
        specialty,
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        bio
      }
    })

    return NextResponse.json(doctor, { status: 201 })
  } catch (error) {
    console.error('Error creating doctor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

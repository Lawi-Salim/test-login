import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Vérification des champs requis
    if (!username || !password) {
      return NextResponse.json({ error: "Nom d'utilisateur et mot de passe requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Ce nom d'utilisateur est déjà pris" }, { status: 400 })
    }

    // Créer le nouvel utilisateur
    const user = await prisma.users.create({
      data: {
        username,
        password, // En production, il faudrait hasher le mot de passe
      },
    })

    // Ne jamais renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Inscription réussie",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
  }
}


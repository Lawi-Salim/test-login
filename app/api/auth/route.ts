import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Vérification des champs requis
    if (!username || !password) {
      return NextResponse.json({ error: "Nom d'utilisateur et mot de passe requis" }, { status: 400 })
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await prisma.users.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    })

    // Vérification de l'utilisateur et du mot de passe
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 })
    }

    // Ne jamais renvoyer le mot de passe au client
    const { password: _, ...userWithoutPassword } = user

    // Authentification réussie
    return NextResponse.json({
      message: "Connexion réussie",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return NextResponse.json({ error: "Erreur lors de la connexion" }, { status: 500 })
  }
}


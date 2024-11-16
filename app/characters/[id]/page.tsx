import prisma from '@/lib/db'

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const character = await prisma.character.findUnique({ where: { id } })
    if (!character) {
        return <div>Personnage non trouvé</div>
    }

    return <div>
        <h1>{character.name}</h1>
        <ul>
            <li>Attaque: {character.attack}</li>
            <li>Défense: {character.defense}</li>
            <li>Points de vie: {character.healthPoints}</li>
            <li>Expérience: {character.experience}</li>
        </ul>
    </div>
}
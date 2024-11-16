import prisma from '@/lib/db'
import Link from 'next/link'

export default async function CharactersPage() {

    const characters = await prisma.character.findMany();

    return <div>
        <h1>Liste de mes personnages pour mon jeu</h1>
        <ul>
            {characters.map((character) => (
                <li key={character.id}>{character.name} <Link href={`/characters/${character.id}`}>Voir</Link></li>
            ))}
        </ul>
    </div>
}

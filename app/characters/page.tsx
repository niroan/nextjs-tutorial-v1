import prisma from '@/lib/db'
import Link from 'next/link'
import { createCharacter } from '@/actions/actions'
export default async function CharactersPage() {

    const characters = await prisma.character.findMany();

    return <div>
        <h1>Liste de mes personnages pour mon jeu</h1>
        <ul>
            {characters.map((character) => (
                <li key={character.id}>{character.name} <Link href={`/characters/${character.id}`}>Voir</Link></li>
            ))}
        </ul>

        <form action={createCharacter} className='bg-gray-100 p-5'>
            <input type="text" name="name" placeholder="Nom du personnage" className='rounded-sm px-2 py-1' />
            <button type="submit" className='bg-blue-500 text-white rounded-sm px-2 py-1'>Créer</button>
        </form>
    </div>
}

# NextJS First Tutorial

## Create a new NextJs App

Launch the terminal and run the following command:
```bash
npx create-next-app@latest .
```

Setup the project with the following options:
```bash
✔ Would you like to use TypeScript? … No / **Yes**
✔ Would you like to use ESLint? … No / **Yes**
✔ Would you like to use Tailwind CSS? … No / **Yes**
✔ Would you like your code inside a `src/` directory? … **No** / Yes
✔ Would you like to use App Router? (recommended) … No / **Yes**
✔ Would you like to use Turbopack for next dev? … **No** / Yes
✔ Would you like to customize the import alias (@/* by default)? … **No** / Yes
```

## Install Prisma

Launch the terminal and run the following command to install Prisma:
```bash
npm install prisma --save-dev
```

Setup Prisma with the init command with the database type SQLite:
```bash
npx prisma init --datasource-provider sqlite
```

## Create Character Model

Add the Character model to the `prisma/schema.prisma` file:
```prisma
model Character {
    id           String   @id @default(cuid())
    name         String   @unique
    attack       Int      @default(10)
    defense      Int      @default(10)
    healthPoints Int      @default(100)
    experience   Int      @default(0)
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
}
```

Push the changes to the database:
```bash
npx prisma db push
```

## Create a new Prisma Client

Create a new file called `lib/db.ts` and add the following code:
```ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
```

## Create Characters Page

Create a new file called `app/characters/page.tsx` and add the following code:
```tsx
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

```

## Create Character Page

Create a new file called `app/characters/[id]/page.tsx` and add the following code:
```tsx
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

```

## Create Actions

Create a new file called `actions/actions.tsx` and add the following code: 
```tsx
'use server'

import prisma from '@/lib/db'

import { revalidatePath } from 'next/cache';

export async function createCharacter(formData: FormData) {
    await prisma.character.create({
        data: {
            name: formData.get('name') as string,
        }
    })
    revalidatePath('/characters');
}

```

Add form to the `app/characters/page.tsx` file:
```tsx
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

``` 

<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->

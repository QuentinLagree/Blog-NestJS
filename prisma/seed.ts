import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcryptjs";

const prisma = new PrismaClient()

async function main () {
    const password = process.env['PASSWORD_SEED'] ?? "Salut1234!"
    
    const salt = genSaltSync(10)

    const quentin = await prisma.user.create({ 
        data: 
        { 
            nom: "Lagree", 
            prenom: "Quentin", 
            email: "lagreequentindev21@gmail.com", 
            pseudo: "QuentinLa", 
            password: hashSync(password, salt), 
            role: "admin", 
            Account: { 
                create: { 
                    followees_count: 0, 
                    followers_count: 0, 
                    language: "fr", 
                    theme: "dark"
                 } 
                } 
            } 
        })
    
    const john = await prisma.user.create({ 
        data: 
        { 
            nom: "John", 
            prenom: "Doe", 
            email: "johndoe@gmail.com", 
            pseudo: "JohnDoe", 
            password: hashSync("Salut1234!", salt), 
            role: "user", 
            Account: { 
                create: { 
                    followees_count: 0,
                    followers_count: 0
                 } 
                } 
            } 
        })

        await prisma.post.createMany({
            data: [{
                authorId: quentin.id,
                title: "Salut je suis un titre très sympathique",
                content: "Salut je suis un contenue"
            },
        {
                authorId: quentin.id,
                title: "Salut je suis un deuxième titre super sympa aussi voir meilleur !",
                content: "Encore du contenue, toujours du contenue"
            }]
        })

    await prisma.follows.create({
        data: {
            followee_id: john.id,   
            follower_id: quentin.id
        }
    })
} 

main()
  .then(() => {
    console.log('✅ Base seedée avec succès')
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PostsEntity } from "src/database/entities/posts/posts.entities";
import { UserEntity } from "src/database/entities/user/user.entities";
import { PostsService } from "src/posts/posts.service";
import { TransformDataMessageIntoObjectSerialization } from "src/usecases/interceptors/transform_data_message_into_object_serialization.interceptor";
import { UserService } from "../user.service";
import { makeMessage, Message } from "src/usecases/utils/logger.utils";
import { Post as Posts, User } from "@prisma/client";
import { ID } from "src/usecases/types/id.types";
import { CreatePostDto } from "src/database/entities/posts/posts.dto";
import { dtoIsValid } from "src/database/entities/user/user.dto";
import { ValidationError } from "class-validator";

@ApiTags("Gestion des Publications en fonction des utilisateurs")
@Controller("users/posts")
@UseInterceptors(new TransformDataMessageIntoObjectSerialization([UserEntity, PostsEntity]))
export class userToPost {
    constructor(
        private readonly _user: UserService,
        private readonly _posts: PostsService,
    ) { }

    @Get(':id')
    async getAllPostOfUser(@Param('id') id: number): Promise<Message<Posts[] | null>> {
        if (!ID.hasValid(id)) throw new HttpException(makeMessage(
              `Error Param ID : '${id}' is invalid.`,
              "L'id doit être un nombre entier.",
              null
            ), HttpStatus.BAD_REQUEST)

        let type_id = ID.add(id);

        try {
            let user: User = await this._user.show({ id: type_id.value() });
            let allName: string = `${user.nom} ${user.prenom}`

            let posts: Posts[] = await this._posts.indexWhere({
                authorId: type_id.value(),
            })

            return (posts.length == 0) ?
                makeMessage(`List of all published posts of ${allName} is empty.`, `La liste des publications publiées de l'utilisateur ${allName} est vide`, null)
                : makeMessage(`List of all published posts of user ${allName}`, `Liste de toutes les publications publiées de ${allName}`, posts)

        } catch (error) {
            switch (true) {
                case error instanceof NotFoundException:
                    throw new HttpException(makeMessage("User Not Exist", `L'utilisateur ${id} n'existe pas.`, null), HttpStatus.NOT_FOUND) 
                default:
                    throw new HttpException(makeMessage("Fatal Error", "Une erreur est survenue, essayer de contacter l'administrateur ou réessayer ultérieurement.", error, { level: "Fatal" }), HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    @Post()
    async publishedPost (@Body() createdPost: CreatePostDto): Promise<Message<Posts | ValidationError[] | null>> {
        const errors: ValidationError[] = await dtoIsValid(createdPost)
        
            if (errors.length > 0) {
              throw new HttpException(makeMessage("User created failed !", "Les données sont incorrectes !", errors), HttpStatus.BAD_REQUEST)
            }
        try {
            let author: User = await this._user.show({ id: createdPost.authorId });
            let newUser = await this._posts.store(createdPost, author)
            return makeMessage("Post created success", `La publication est créer, aller sur votre compte pour la visualiser.`, newUser)
        } catch (error) {
            switch (true) {
                case error instanceof NotFoundException:
                throw new HttpException(makeMessage("Post created failed", `Ce compte n'existe pas. La création de la publication a été interrompue`, null), HttpStatus.NOT_FOUND) 

                case error instanceof BadRequestException:
                    throw new HttpException(makeMessage("Post created failed", `Une erreur lors de la création de votre publication s'est produite, si cela recommence, contactez un administrateur.`, null), HttpStatus.INTERNAL_SERVER_ERROR)
                
                default:
                    throw new HttpException(makeMessage("Fatal Error", "Une erreur est survenue, essayer de contacter l'administrateur ou réessayer ultérieurement.", error, { level: "Fatal" }), HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }
}
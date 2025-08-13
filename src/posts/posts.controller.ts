import { Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Post as Posts } from "@prisma/client";
import { PostsEntity } from "src/database/entities/posts/posts.entities";
import { TransformDataMessageIntoObjectSerialization } from "src/usecases/interceptors/transform_data_message_into_object_serialization.interceptor";
import { makeMessage, Message } from "src/usecases/utils/logger.utils";
import { PostsService } from "./posts.service";
import { ID } from "src/usecases/types/id.types";



@ApiTags("Gestion des Publications")
@Controller('posts')
@UseInterceptors(new TransformDataMessageIntoObjectSerialization([PostsEntity]))
export class PostController {

  constructor(private readonly _posts: PostsService) { }

  
  @Get()
  async index(): Promise<Message<Posts[] | null>> {
    try {
      const posts: Posts[] = await this._posts.index();
      return (posts.length == 0) ?
        makeMessage("List of all posts is empty.", "La liste des publications est vide", null)
        : makeMessage("List of all posts", "Liste de toutes les publications", posts)

    } catch (error) {
      switch (true) {
        default:
            throw new HttpException(makeMessage("Fatal Error", "Une erreur est survenue, essayer de contacter l'administrateur ou réessayer ultérieurement.", error, { level: "Fatal" }), HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  @Get("/published")
  async indexPublished(): Promise<Message<Posts[] | null>> {
    try {
      const posts: Posts[] = await this._posts.index(true);
      return (posts.length == 0) ?
        makeMessage("List of all published posts is empty.", "La liste des publications publiées est vide", null)
        : makeMessage("List of all published posts", "Liste de toutes les publications publiées", posts)

    } catch (error) {
      switch (true) {
        default:
          throw new HttpException(makeMessage("Fatal Error", "Une erreur est survenue, essayer de contacter l'administrateur ou réessayer ultérieurement.", error, { level: "Fatal" }), HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  @Get('/:id')
  async show(@Param('id') id: number): Promise<Message<Posts | null>> {

    if (!ID.hasValid(id)) throw new HttpException(makeMessage(
      `Error Param ID : '${id}' is invalid.`,
      "L'id doit être un nombre entier.",
      null
    ), HttpStatus.BAD_REQUEST)

    let type_id = ID.add(id);
    try {
      const user = await this._posts.show({ id: type_id.value() });
      return makeMessage(
        `Post found with ID: ${user.id}!`,
        `La publication ${user.id} a bien été trouvé.`,
        user
      );
    } catch (error) {
      switch (true) {
        case error instanceof NotFoundException:
          throw new HttpException(makeMessage(`Posts Not Found with id ${type_id.value()}`,
            `La publication ${type_id.value()} n'a pas été trouvé.`,
            null), HttpStatus.NOT_FOUND)

        default:
          throw new HttpException(makeMessage("Fatal Error", "Une erreur est survenue, essayer de contacter l'administrateur ou réessayer ultérieurement.", error, { level: "Fatal" }), HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
  }


  @Delete(':id')
  async destroy(@Param('id') id: number): Promise<Message<null>> {
    if (!ID.hasValid(id)) throw new HttpException(makeMessage(
      `Error Param ID : '${id}' is invalid.`,
      "L'id doit être un nombre entier.",
      null
    ), HttpStatus.BAD_REQUEST)

    let id_type: ID = ID.add(id)

    try {
      await this._posts.destroy({ id: id_type.value() })
      return makeMessage("Post deleted !", "La suppression de votre publication est un succée !", null)
    } catch (error) {
      switch (true) {
        case error instanceof NotFoundException:
          throw new HttpException(makeMessage("Post deleted failed", `Cette publication n'existe pas.`, null), HttpStatus.NOT_FOUND)

        default:
          throw new HttpException(makeMessage("Fatal Error", "Une erreur est survenue, essayer de contacter l'administrateur ou réessayer ultérieurement.", error, { level: "Fatal" }), HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}

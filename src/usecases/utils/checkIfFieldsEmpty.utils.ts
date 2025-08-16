import { ClassConstructor } from "class-transformer";
import { dto, dtoIsValid, UserPasswordFields } from "src/database/entities/user/user.dto";
import { makeMessage, Message } from "./logger.utils";
import { ValidationError } from "class-validator";
import { isFieldsInvalid } from "../../commons/utils/exceptions/isFieldsInvalids.error";

export const checkFieldIsEmpty = async (dto: dto, targetDto: ClassConstructor<dto>) => {
    const errors: ValidationError[] = await dtoIsValid(dto, targetDto)
    
    if (errors.length > 0) {
        throw new isFieldsInvalid(errors);
    }
}
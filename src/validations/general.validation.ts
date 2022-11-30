import Joi from 'joi';
import JoiPassword from 'joi-password';

/** Joi schema */
export const string = Joi.string().trim();
export const number = Joi.number();
export const boolean = Joi.boolean();
export const dateIso = Joi.date().iso();
export const array = (item) => Joi.array().items(item);
export const object = <T = any>(keys: Joi.PartialSchemaMap<T>) => Joi.object<T>().keys(keys);
export const objectIdString = string.hex().length(24);

/** Custom schema */
export const password = JoiPassword.string()
    .min(8)
    .max(50)
    .minOfUppercase(1)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .noWhiteSpaces();

export const pageNumber = number.integer().min(1).default(1);

export const limitItemNumber = number.integer().min(1).max(50).default(10);

export const unixTimestampNumber = number.integer().min(0);

export const emailString = Joi.string().email();

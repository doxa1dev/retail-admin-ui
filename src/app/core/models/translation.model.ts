export class TranslationProduct {
    id: string; // translation id
    productId: string;
    language: string;
    title: string;
    description: string;
}

export class TranslationCategory {
    id: string; // translation id
    categoryId: string;
    language: string;
    title: string;
    description: string;
}

export enum LanguageEnum {
    ENGLISH_ID = 1,
    CHINESE_ID = 4,
    MALAY_ID = 5
}
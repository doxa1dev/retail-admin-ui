export class Category
{
    id: number;
    entityId: number;
    publicId: string;
    categoryUri: string;
    isActive: boolean;
    categoryName: string;
    categoryDescription: string;
    categoryPhotoKey: string;
    createdAt: Date;
    updatedAt: Date;
    isDefaultCategory: boolean;
}
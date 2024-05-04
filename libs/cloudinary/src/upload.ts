import cloudinary from "./client"

export const upload = async (file: string, folder: string) => {
    const uploadedResponse = await cloudinary.uploader.upload(file, { folder })
    return uploadedResponse
}


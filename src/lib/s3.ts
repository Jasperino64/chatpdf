import AWS from 'aws-sdk';

export async function uploadeFileToS3(file: File) {
    try {
        console.log('Bucket name', process.env.NEXT_PUBLIC_AWS_BUCKET_NAME)
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME },
            region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
        });

        const fileKey = `uploads/${Date.now()}-${file.name.replace(' ', '_')}`;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileKey,
            Body: file,

        };

        const upload = s3.putObject(params).on('httpUploadProgress', (evt) => {
            console.log(`Uploading... ${parseInt((evt.loaded * 100 / evt.total).toString(), 10)}%`);
        }).promise();

        await upload.then((data) => {
            console.log('Upload completed successfully', fileKey);
        }).catch((err) => {
            console.log(err);
        });

        return Promise.resolve({
            fileKey,
            fileName: file.name,
        });
    } catch (error) {

    }
}

export function getS3FileUrl(fileKey: string) {
    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;
}

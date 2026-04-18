import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const generateUploadUrl = async (key: string, contentType: string): Promise<string> => {
  const bucket = process.env.S3_EVIDENCE_BUCKET || 'regshield-evidence-dev';
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 mins
};

export const generateDownloadUrl = async (key: string): Promise<string> => {
  const bucket = process.env.S3_EVIDENCE_BUCKET || 'regshield-evidence-dev';
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 mins
};

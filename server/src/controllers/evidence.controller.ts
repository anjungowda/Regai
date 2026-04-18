import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/prisma';
import { uploadEvidenceSchema, updateEvidenceSchema } from '../utils/validators';
import { UnauthorisedError, NotFoundError } from '../utils/errors';
import { generateUploadUrl, generateDownloadUrl } from '../utils/s3';

export const getEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const evidence = await prisma.evidence.findMany({
      where: { caseId: req.params.caseId, orgId: req.user.orgId, isDeleted: false },
      include: { uploader: { select: { fullName: true } } },
      orderBy: { uploadedAt: 'desc' },
    });

    return res.json({ data: evidence });
  } catch (error) {
    next(error);
  }
};

export const requestUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = uploadEvidenceSchema.parse(req.body);

    const s3Key = `${req.user.orgId}/${req.params.caseId}/${uuidv4()}-${data.fileName}`;
    const uploadUrl = await generateUploadUrl(s3Key, data.fileType);

    const evidence = await prisma.evidence.create({
      data: {
        orgId: req.user.orgId,
        caseId: req.params.caseId,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        category: data.category,
        s3Key,
        s3Bucket: process.env.S3_EVIDENCE_BUCKET || 'regshield-evidence-dev',
        uploadedBy: req.user.userId,
      },
    });

    return res.status(201).json({
      data: { uploadUrl, evidenceId: evidence.id, s3Key },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const evidence = await prisma.evidence.findFirst({
      where: { id: req.params.evidenceId, caseId: req.params.caseId, orgId: req.user.orgId },
    });

    if (!evidence) throw new NotFoundError('Evidence not found');

    res.locals.entityId = evidence.id;
    res.locals.auditDetail = { fileName: evidence.fileName };

    return res.json({ message: 'Evidence upload confirmed' });
  } catch (error) {
    next(error);
  }
};

export const updateEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const data = updateEvidenceSchema.parse(req.body);

    const evidence = await prisma.evidence.findFirst({
      where: { id: req.params.evidenceId, caseId: req.params.caseId, orgId: req.user.orgId },
    });

    if (!evidence) throw new NotFoundError('Evidence not found');

    const updated = await prisma.evidence.update({
      where: { id: evidence.id },
      data,
    });

    res.locals.entityId = updated.id;
    res.locals.auditDetail = { newStatus: data.verificationStatus };

    return res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const evidence = await prisma.evidence.findFirst({
      where: { id: req.params.evidenceId, caseId: req.params.caseId, orgId: req.user.orgId },
    });

    if (!evidence) throw new NotFoundError('Evidence not found');

    await prisma.evidence.update({
      where: { id: evidence.id },
      data: {
        isDeleted: true,
        deletedBy: req.user.userId,
        deletedAt: new Date(),
      },
    });

    res.locals.entityId = evidence.id;
    res.locals.auditDetail = { fileName: evidence.fileName };

    return res.json({ message: 'Evidence soft-deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const downloadEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorisedError();

    const evidence = await prisma.evidence.findFirst({
      where: { id: req.params.evidenceId, orgId: req.user.orgId, isDeleted: false },
    });

    if (!evidence) throw new NotFoundError('Evidence not found');

    const downloadUrl = await generateDownloadUrl(evidence.s3Key);

    return res.json({ data: { downloadUrl } });
  } catch (error) {
    next(error);
  }
};

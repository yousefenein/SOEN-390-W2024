
// Filename: files.ts
// Author: Sarah Abellard
// Description: Backend file to upload files and view files
// Dependencies: jwt, prisma, express, dotenv, multer
import { createClient } from '@supabase/supabase-js';
import express from "express";
import multer from "multer";
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verify-token";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 7 * 1024 * 1024  // Limit file size to 5MB
    }
  });
  
const router = express.Router();


router.post('/upload-file', verifyToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    const { buffer, originalname, mimetype } = req.file;
    const { property_id, file_type, description } = req.body; // Add file_type and description

    try {
        const decoded = jwt.verify(req.token as string, process.env.SECRET as jwt.Secret);
        const { id, role } = (<any>decoded).data;

        if (role !== "company") {
            return res.status(401).json({ message: "Unauthorized: Access is limited to company accounts only." });
        }

        const filePath = `property-files/${property_id}/${originalname}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property-files')
            .upload(filePath, buffer, {
                contentType: mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('property-files')
            .createSignedUrl(filePath, 60 * 60);

        if (signedUrlError) throw signedUrlError;

        const fileEntry = await prisma.condo_management_files.create({
            data: {
                file_key: uploadData.path,
                file_type: file_type,
                company_id: id,
                property_id: parseInt(property_id),
                description: description,
                signed_url: signedUrlData.signedUrl
            }
        });

        res.json({
            message: 'File uploaded successfully',
            data: fileEntry,
            signedUrl: signedUrlData.signedUrl
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Failed to upload file');
    }
});



router.get('/list-files', verifyToken, async (req, res) => {
    // Ensure property_id is a string and is not undefined
    const propertyId = req.query.property_id;

    if (typeof propertyId !== 'string') {
        return res.status(400).json({ message: "Invalid or missing property ID." });
    }

    const property_id = parseInt(propertyId, 10); // Use radix 10 for decimal

    try {
        const decoded = jwt.verify(req.token as string, process.env.SECRET as jwt.Secret);
        const { id, role } = (<any>decoded).data;



        if (role === "company"){
            const files = await prisma.condo_management_files.findMany({
                where: {
                    property_id: property_id,  // Use the parsed integer value
                    company_id: id
                },
                select: {
                    file_key: true,
                    file_type: true,
                    description: true,
                    signed_url: true,
                }
            });

            if (!files.length) {
                // No files found, provide a specific error message
                return res.status(404).json({ message: 'No files found for the specified property.' });
            }
    
            res.json({ files });
        }
        
        if (role === "publicUser"){
            const files = await prisma.condo_management_files.findMany({
                where: {
                    property_id: property_id,  // Use the parsed integer value
                },
                select: {
                    file_key: true,
                    file_type: true,
                    description: true,
                    signed_url: true,
                }
            });

            if (!files.length) {
                // No files found, provide a specific error message
                return res.status(404).json({ message: 'No files found for the specified property.' });
            }
    
            res.json({ files });

        }
        
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ message: 'Failed to list files due to server error.' });
    }
});

export default router;



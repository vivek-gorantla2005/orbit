import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BACKEND_ROUTE } from '@/backendRoutes';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Slash, UploadCloud } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';

const fileTypes = {
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

const AttachSection = ({ onClose, onSendAttachment }) => {
    const { data: session } = useSession();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [category, setCategory] = useState("image");
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(file => fileTypes[category].includes(file.type));
        if (validFiles.length) {
            setSelectedFiles(validFiles);
        } else {
            alert("Some files were invalid. Only valid files were kept.");
        }
    }, [category]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: fileTypes[category].join(", ")
    });

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setSelectedFiles([]);
    };

    const handleSendFile = async () => {
        if (selectedFiles.length > 0) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("userId",session?.user?.id as string)
            selectedFiles.forEach(file => {
                formData.append('files', file); 
            });

            try {
                const response = await fetch(`${BACKEND_ROUTE}/api/upload`, {
                    method: 'POST',
                    body: formData,
                });
            
                const data = await response.json();

                if (data.urls && Array.isArray(data.urls)) {
                    data.urls.forEach((url: string) => onSendAttachment(url));
                }

                console.log('Files uploaded successfully:', data);
            } catch (error) {
                console.error('Error uploading files:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <p className='font-bold mb-2'>Send Files</p>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem onClick={() => handleCategoryChange('audio')} className="cursor-pointer">
                                    <div className='flex gap-2'>
                                        <div>Audio Files</div>
                                        <img src="mic.png" alt="mic" width={20} height={20} />
                                    </div>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
                                <BreadcrumbItem onClick={() => handleCategoryChange('image')} className="cursor-pointer">
                                    <div className='flex gap-2'>
                                        <div>Image Files</div>
                                        <img src="img.png" alt="img" width={20} height={20} />
                                    </div>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
                                <BreadcrumbItem onClick={() => handleCategoryChange('document')} className="cursor-pointer">
                                    <div className='flex gap-2'>
                                        <div>Document Files</div>
                                        <img src="google-docs.png" alt="docs" width={20} height={20} />
                                    </div>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Choose files to attach to your message.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100">
                    <input {...getInputProps()} />
                    <UploadCloud size={40} className="mx-auto text-gray-500" />
                    <p className="mt-2 text-gray-600">Drag & drop {category} files here, or click to select</p>
                    {selectedFiles.length > 0 && (
                        <div className="text-sm mt-2 text-gray-700">
                            {selectedFiles.map((file, i) => (
                                <p key={i}>{file.name}</p>
                            ))}
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!selectedFiles.length || isUploading}
                        onClick={async () => {
                            await handleSendFile();
                            onClose();
                        }}
                    >
                        {isUploading ? 'Uploading...' : 'Send'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AttachSection;

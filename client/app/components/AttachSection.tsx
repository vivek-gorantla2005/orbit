import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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

const fileTypes = {
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    image: ['image/jpeg', 'image/png', 'image/gif'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

const AttachSection = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [category, setCategory] = useState("image");

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: fileTypes[category].join(", ")
    });

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setSelectedFile(null); 
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
                        Choose a file to attach to your message.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                {/* Drag and Drop Section */}
                <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100">
                    <input {...getInputProps()} />
                    <UploadCloud size={40} className="mx-auto text-gray-500" />
                    <p className="mt-2 text-gray-600">Drag & drop a {category} file here, or click to select</p>
                    {selectedFile && <p className="text-sm mt-2 text-gray-700">Selected: {selectedFile.name}</p>}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={!selectedFile} onClick={() => { console.log('File uploaded:', selectedFile); onClose(); }}>
                        Send
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AttachSection;
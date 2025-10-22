/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useCallback } from 'react';
import { generateImageWithPrompt } from './services/geminiService';

const App: React.FC = () => {
    const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleImageChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file (PNG, JPG, etc.).');
                return;
            }
            setOriginalImageFile(file);
            setOriginalImageUrl(URL.createObjectURL(file));
            setGeneratedImageUrl(null);
            setError(null);
        }
    };

    const handleGenerateClick = async () => {
        if (!originalImageFile || !prompt) {
            setError('Please upload an image and enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        try {
            const resultUrl = await generateImageWithPrompt(originalImageFile, prompt);
            setGeneratedImageUrl(resultUrl);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleImageChange(files);
        }
    }, []);

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                    Pixshop
                </h1>
                <p className="mt-2 text-lg text-gray-300">AI-powered photo editing at your fingertips.</p>
            </header>

            <main className="w-full max-w-5xl bg-black bg-opacity-30 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Side */}
                    <div className="flex flex-col gap-4">
                        <label
                            htmlFor="file-upload"
                            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${dragOver ? 'border-purple-400 bg-purple-900/20' : 'border-gray-600 hover:border-gray-500 bg-gray-800/20'}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {originalImageUrl ? (
                                <img src={originalImageUrl} alt="Original" className="object-contain w-full h-full p-2 rounded-lg" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <p className="mt-2">Drag &amp; drop an image here</p>
                                    <p className="text-xs">or click to upload</p>
                                </div>
                            )}
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageChange(e.target.files)} />
                        </label>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your edit, e.g., 'make the sky a vibrant sunset'"
                            className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-gray-500 resize-none"
                            rows={4}
                        />

                        <button
                            onClick={handleGenerateClick}
                            disabled={isLoading || !originalImageFile || !prompt}
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : "Generate Image"}
                        </button>
                    </div>

                    {/* Output Side */}
                    <div className="relative flex items-center justify-center w-full h-full min-h-[350px] md:min-h-full bg-gray-800/20 border-2 border-dashed border-gray-600 rounded-lg p-2">
                         {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10 rounded-lg">
                                <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="mt-4 text-lg">Generating your masterpiece...</p>
                            </div>
                        )}
                        {generatedImageUrl && !isLoading && (
                             <img src={generatedImageUrl} alt="Generated" className="object-contain w-full h-full max-h-[400px] md:max-h-full rounded-lg" />
                        )}
                        {!generatedImageUrl && !isLoading && (
                            <div className="text-center text-gray-500">
                                <p>Your generated image will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {error && (
                    <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg text-center">
                        <p className="font-bold">An Error Occurred</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;

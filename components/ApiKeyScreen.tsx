/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface ApiKeyScreenProps {
  onSelectKey: () => void;
  onSaveKey: (key: string) => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onSelectKey, onSaveKey }) => {
  const [manualApiKey, setManualApiKey] = useState('');

  const handleSaveClick = () => {
    if (manualApiKey.trim()) {
      onSaveKey(manualApiKey.trim());
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveClick();
  };
  
  // Reliably check for the AI Studio environment directly at render time.
  // This avoids state-related race conditions during initial load.
  const isStudioEnv = window.aistudio && typeof window.aistudio.openSelectKey === 'function';

  return (
    <div className="w-full max-w-2xl mx-auto text-center p-8 rounded-2xl bg-gray-800/50 border border-gray-700/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-100 sm:text-5xl">
          API Key Required
        </h1>
        <p className="text-lg text-gray-400">
          To use the generative AI features of Pixshop, you need a Google AI API key. Your key is used only for processing your requests.
        </p>

        {isStudioEnv ? (
          <>
            <p className="text-gray-400">Please select your key to continue.</p>
            <div className="mt-4">
              <button 
                onClick={onSelectKey} 
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full cursor-pointer group hover:bg-blue-500 transition-colors"
              >
                Select API Key
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-400">
              Please enter your key below. It will be saved in your browser's local storage for future visits.
            </p>
            <form onSubmit={handleFormSubmit} className="mt-4 w-full flex flex-col sm:flex-row items-center gap-2">
              <input
                type="password"
                value={manualApiKey}
                onChange={(e) => setManualApiKey(e.target.value)}
                placeholder="Enter your Google AI API Key"
                className="flex-grow bg-gray-900 border border-gray-700 text-gray-200 rounded-lg p-4 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
                aria-label="Google AI API Key"
              />
              <button 
                type="submit"
                disabled={!manualApiKey.trim()}
                className="w-full sm:w-auto shrink-0 relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
              >
                Save &amp; Continue
              </button>
            </form>
          </>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          This app uses generative models that may have associated billing costs. For more information, please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">billing documentation</a>.
        </p>

      </div>
    </div>
  );
};

export default ApiKeyScreen;
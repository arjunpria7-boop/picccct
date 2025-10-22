/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface ApiKeyScreenProps {
  onSelectKey: () => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onSelectKey }) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center p-8 rounded-2xl bg-gray-800/50 border border-gray-700/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-100 sm:text-5xl">
          API Key Required
        </h1>
        <p className="text-lg text-gray-400">
          To use the generative AI features of Pixshop, you need to select a Google AI API key. Your key is used only for processing your requests and is not stored by this application.
        </p>
        <p className="text-sm text-gray-500">
          This app uses generative models that may have associated billing costs. For more information, please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">billing documentation</a>.
        </p>
        <div className="mt-4">
          <button 
            onClick={onSelectKey} 
            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full cursor-pointer group hover:bg-blue-500 transition-colors"
          >
            Select API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyScreen;
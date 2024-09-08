"use client";

import React, { useState } from 'react';

const Button = ({ children, onClick, disabled, className, selected }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${
      selected
        ? 'bg-blue-600 text-white'
        : 'bg-white text-blue-600 border border-blue-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'} ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-lg rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

export default function Home() {
  const [selectedCost, setSelectedCost] = useState(null);
  const [selectedDays, setSelectedDays] = useState(null);
  const [hasAccommodation, setHasAccommodation] = useState(null);
  const [travelerType, setTravelerType] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (selectedCost && selectedDays && hasAccommodation !== null && travelerType) {
      setIsLoading(true);
      setError(null);
      
      const userPrompt = `Create a ${selectedDays}-day itinerary for a ${travelerType} visiting Lisbon with a ${selectedCost} budget. ${hasAccommodation ? "They have accommodation arranged." : "They need accommodation recommendations."} Provide specific recommendations for activities, restaurants, and attractions.`;

      const apiBody = {
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable travel assistant specializing in Lisbon, Portugal. Provide detailed and personalized travel itineraries based on user preferences."
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      };

      try {
        const response = await fetch('/api/getItinerary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiBody),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch itinerary');
        }

        const data = await response.json();
        setItinerary(data.result.response);
      } catch (err) {
        setError('An error occurred while fetching your itinerary. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <Card className="w-full max-w-md mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome to Lisbon Travel</h1>
        <p className="text-center mb-6">Get personalized travel recommendations for your Lisbon adventure!</p>
        
        {!itinerary ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Select your budget:</h3>
              <div className="flex space-x-2">
                {['$', '$$', '$$$'].map((cost) => (
                  <Button
                    key={cost}
                    onClick={() => setSelectedCost(cost)}
                    selected={selectedCost === cost}
                    className="w-16"
                  >
                    {cost}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">How many days?</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((days) => (
                  <Button
                    key={days}
                    onClick={() => setSelectedDays(days)}
                    selected={selectedDays === days}
                    className="w-16"
                  >
                    {days}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Do you already have a place to stay?</h3>
              <div className="flex space-x-2">
                {['Yes', 'No'].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setHasAccommodation(option === 'Yes')}
                    selected={hasAccommodation === (option === 'Yes')}
                    className="flex-1"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What kind of traveler are you?</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Explorer', 'Relaxer', 'Eater', 'Anthropologist'].map((type) => (
                  <Button
                    key={type}
                    onClick={() => setTravelerType(type)}
                    selected={travelerType === type}
                    className="w-full"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={handleSubmit} 
                disabled={!selectedCost || !selectedDays || hasAccommodation === null || !travelerType || isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating Itinerary...' : 'Get Recommendations'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Personalized Lisbon Itinerary</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{itinerary}</pre>
            </div>
            <button 
              onClick={() => setItinerary(null)} 
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Start Over
            </button>
          </div>
        )}
        
        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}
      </Card>
      <footer className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg px-4 py-2 text-center text-blue-900 shadow-md">
        <p>
          Looking for a static list? Visit{' '}
          <a 
            href="https://lisbon.samrhea.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            lisbon.samrhea.com
          </a>
        </p>
      </footer>
    </div>
  );
}
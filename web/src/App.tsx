import { useEffect, useState } from "react";
import catImage from "./assets/rk4zn7ewin691.jpg";
import "./App.css";

const IS_PROD = import.meta.env.PROD;
const API_URL = IS_PROD ? "hi" : "http://localhost:3000";

const getVisitorSuffix = (visitorNumber: number) => {
  const lastDigit = visitorNumber % 10;
  const lastTwoDigits = visitorNumber % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${visitorNumber}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${visitorNumber}st`;
    case 2:
      return `${visitorNumber}nd`;
    case 3:
      return `${visitorNumber}rd`;
    default:
      return `${visitorNumber}th`;
  }
};

const App = () => {
  const [visitors, setVisitors] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();
        setVisitors(data.visitors);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-pink-100">
      <header className="w-full text-center py-4">
        <h1 className="text-3xl font-bold text-pink-600">
          Hello, this is our site!
        </h1>
      </header>

      <main className="flex-grow flex items-center justify-center overflow-hidden">
        <img
          src={catImage}
          alt="Cat"
          className="rounded-lg max-h-[calc(100vh-200px)] w-auto"
        />
      </main>

      <footer className={`w-full text-center py-4 ${visitors > 0 ? 'visible' : 'invisible'}`}>
        <p className="text-xl text-purple-600 font-semibold">
          You are the {getVisitorSuffix(visitors)} visitor of this site 😮
        </p>
      </footer>
    </div>
  );
};

export default App;

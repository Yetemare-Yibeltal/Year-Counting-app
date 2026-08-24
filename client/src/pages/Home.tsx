import React from "react";
import AgeCalculatorView from "../components/calculator/AgeCalculatorView";
import YearProgressBar from "../components/dashboard/YearProgressBar";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Year Counting & Time Calculator
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Calculate precise year intervals, age breakdown, and track real-time year progress effortlessly.
          </p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <YearProgressBar />
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <AgeCalculatorView />
        </section>
      </div>
    </div>
  );
};

export default Home;
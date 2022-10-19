import React, { useEffect, useState } from 'react';
import { Loader } from './components';

const App = () => {
  const [workingDays, setWorkingDays] = useState();
  const [remainingWorkingDays, setRemainingWorkingDays] = useState();

  const today = new Date();
  const [firstLetter, ...restLetters] = today.toLocaleString('cs', { month: 'long' });
  const capitalizedMonth = `${firstLetter.toUpperCase()}${restLetters.join('')}`

  const fetchWoringDays = async () => {
    try {
      const startDate = new Date(today); startDate.setDate(1);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(0);

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
          'X-RapidAPI-Host': 'working-days.p.rapidapi.com'
        }
      };

      const responseWhole = await fetch(
        `https://working-days.p.rapidapi.com/analyse?country_code=CZ&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`, options
      );
      const { result: { working_days: { total: totalWhole } } } = await responseWhole.json();

      const responseRemaining = await fetch(
        `https://working-days.p.rapidapi.com/analyse?country_code=CZ&start_date=${today.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`, options
      );
      const { result: { working_days: { total: totalRemaining } } } = await responseRemaining.json();

      setWorkingDays(totalWhole);
      setRemainingWorkingDays(totalRemaining);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWoringDays();
  }, []);

  return (
    <div className='flex justify-center items-center w-screen h-screen bg-bg-image bg-cover bg-center'>
      <div className='flex flex-col justify-center items-center gap-8 rounded-xl p-8 m-4 bg-gray-600 bg-opacity-60 backdrop-blur-sm shadow-lg'>
        <p className='text-2xl md:text-4xl tracking-widest text-white'>{capitalizedMonth.toUpperCase()}</p>
        {
          remainingWorkingDays
            ? (
              <>
                <p className='text-4xl md:text-6xl text-white'>Zbývá pracovních dnů: <span className='font-bold white-white'>{remainingWorkingDays}</span></p>
                <p className='text-3xl md:text-5xl text-white'>Pracovních dnů: <span className='font-semibold white-white'>{workingDays}</span></p>
              </>
            )
            : (
              <Loader />
            )
        }
      </div>
    </div>
  );
};

export default App;
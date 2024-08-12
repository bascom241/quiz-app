import React, { useEffect, useState, useRef } from 'react';
import './Quiz.css';

const Quiz = () => {
    const API_URL = 'http://localhost:3500/quizes';
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let [index, setIndex] = useState(0);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0)


    const [result, setResult] = useState(false)

    const option1 = useRef(null);
    const option2 = useRef(null);
    const option3 = useRef(null);
    const option4 = useRef(null);

    const optionList = [option1, option2, option3, option4]


    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setQuestions(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAPI();
    }, []);

    if (isLoading) {
        return <div className='container'>Loading...</div>;
    }

    if (error) {
        return <div className='container'>Error: {error}</div>;
    }

    if (questions.length === 0) {
        return <div className='container'>No questions available</div>;
    }

    // Access the first question directly

    const nextQuestion = (e) => {
        if (index === questions.length - 1) {
            setResult(true);
            return null
        }

        if (lock === true) {
            e.target.classList.add('blur')
            setIndex(prevIndex => {
                setLock(false);
                optionList.forEach(option => {
                    if (option.current) {
                        option.current.classList.remove("correct", "incorrect");
                    }
                });
                return prevIndex + 1;
            });
        }
    };

    const firstQuestion = questions[index];
    const checkAns = (e, ans) => {
        if (lock === false) {
            if (firstQuestion.answer === ans) {
                e.target.classList.add("correct")
                setLock(true)
                setScore(prev => prev + 1)
            } else {
                e.target.classList.add("incorrect")
                setLock(true)
                optionList[firstQuestion.answer - 1].current.classList.add("correct");

            }
        }

    }

    const reset = () => {
        setIndex(0);
        setScore(0);
        setLock(false);
        setResult(false)
    }


    return (
        <div className='container'>
            <h1>Anatomy Quiz App</h1>
            <hr />
            {result ? <>
                <div className='div final'>
                    <h2>You score {score} out of {questions.length}</h2>
                    <button onClick={reset}>Reset</button>
                </div>
            </> : <>
                <div key={firstQuestion.id}>


                    <h2>{index + 1}. {firstQuestion.Question}</h2>
                    <ul>
                        <li ref={option1} onClick={(e) => { checkAns(e, 1) }}>{firstQuestion.option1}</li>
                        <li ref={option2} onClick={(e) => { checkAns(e, 2) }}>{firstQuestion.option2}</li>
                        <li ref={option3} onClick={(e) => { checkAns(e, 3) }}>{firstQuestion.option3}</li>
                        <li ref={option4} onClick={(e) => { checkAns(e, 4) }}>{firstQuestion.option4}</li>
                    </ul>
                </div>
                <div className='div'>
                    <button onClick={nextQuestion}>Next</button>
                    <p>{index + 1} out of {questions.length}</p>
                </div>
            </>
            }


        </div>
    );
};

export default Quiz;

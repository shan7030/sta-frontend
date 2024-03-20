import { useState, useEffect } from 'react';
import Select from 'react-select';
import './App.css';
import { Products } from './components/Products';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = "https://stat220-project-server.onrender.com";
const COURSERA = "https://about.coursera.org/static/whiteCoursera-23ec484f7091914430ce19b07d09aedf.svg";
const PLURALSIGHT = "https://www.insightpartners.com/wp-content/uploads/2018/06/PLURALSIGHT.png";
const UDEMY = "https://s.udemycdn.com/meta/default-meta-image-v2.png";


function App() {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);


  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 700, // Adjust the width as needed
      fontSize: '18px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black', // Set text color to black
      fontSize: '18px',
    }),
    option: (provided) => ({
      ...provided,
      color: 'black', // Set options text color to black
      fontSize: '18px',
    }),
  };


  useEffect(() => {
    // Fetch data from API
    fetch(`${BACKEND_URL}/all-courses/`)
      .then(response => response.json())
      .then(data => {
        // Data received, set options
        const optionsValues = [];

        for (let i = 0; i < data.length; i++) {
          optionsValues.push({
            value: data[i]['course_id'],
            label: data[i]['course_title']
          })
        }

        setOptions(optionsValues);
        setIsLoadingData(false);

      })
      .catch(error => {
        toast.error("Error fetching data!");
        console.error('Error fetching data:', error);
      });
  }, []); // Run once on component mount


  const handleButtonClick = () => {
    // Handle button click action here

    if (selectedOption) {
      // Access the selected option value
      const courseTitle = selectedOption.label;

      // Call the endpoint with the selected course title
      fetch(`${BACKEND_URL}/results/?course_title=${encodeURIComponent(courseTitle)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Handle the response data here
          setResults(data);
        })
        .catch(error => {
          setResults([]);
          toast.error("Error fetching data!");
          console.error('Error fetching data:', error);
        });


    } else {
      setResults([]);
      toast.error("No option selected!");
    }

  };

  const handleOptionChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const getUrl = (contents) => {
    const course_id = contents.course_id;
    const firstTwoChars = course_id.substring(0, 2);

    if (firstTwoChars === "ce") {
      return COURSERA;
    }
    else if (firstTwoChars === "ud") {
      return UDEMY;
    }

    return PLURALSIGHT;

  }


  return (
    <div className='main-container'>
      <div className='header'>
        <h1>Course Recommender</h1>
      </div>

      <div className='selection'>
        <Select
          options={options}
          styles={customStyles}
          onChange={handleOptionChange}
          isLoading={isLoadingData}
          placeholder={isLoadingData ? "Course Data Loading, Please wait..." : "Select a course..."}
          isDisabled={isLoadingData} />

        <button
          className="App-button"
          onClick={handleButtonClick}
          disabled={isLoadingData || selectedOption === null}>Recommend Courses</button>
      </div>

      <div className='course-results'>
        {results.map((contents, index) => (

          <Products
            key={contents.course_id}
            image={getUrl(contents)}
            name={contents.course_title}
            duration={contents.course_duration}
            courseInstructor={contents.course_instructor}
            rating={contents.course_rating}
            courseUrl={contents.course_url}
          />
        ))}
      </div>

      <div className='spacer'></div>
      <ToastContainer />
    </div>
  );
}

export default App;

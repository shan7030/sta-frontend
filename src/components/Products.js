import { FaStar } from 'react-icons/fa';

export function Products(props) {

    const formatDuration = (durationInHours) => {
        if (durationInHours === -1) {
            return "Unavailable";
        }

        if (durationInHours < 1) {
            const durationInMinutes = (durationInHours * 60).toFixed(2); // Convert to minutes and round to 2 decimal places
            return `${durationInMinutes} minutes`;
        } else {
            return `${durationInHours.toFixed(2)} hours`; // Round hours to 2 decimal places
        }
    }

    const handleDivClick = () => {
        const url = props.courseUrl; // Replace 'https://example.com' with your desired external URL
        window.open(url, '_blank'); // Open URL in new tab
    };

    return (
        <div className='productList' key={props.course_id} onClick={handleDivClick}>
            <img src={props.image} alt='product-img' className='productImage'></img>
            <div className='productCard__content'>
                <h3 className='productName'>{props.name}</h3>

                <p className='authorName'>By: {props.courseInstructor}</p>

                {<div className='productRating'>
                    {[...Array(5)].map((index, ind) => {
                        if (ind < Math.ceil(props.rating)) {
                            return <FaStar id={ind + 1} key={ind} style={{ color: 'orange', padding: '4px' }} />
                        }
                        else {
                            return <FaStar id={ind + 1} key={ind} style={{ color: 'white', padding: '4px' }} />
                        }
                    })}
                </div>
                }

                <p className='courseDuration'> {`Duration:  ${formatDuration(props.duration)}`}</p>

            </div>


        </div>
    )
}
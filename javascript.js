"use strict";
// email setup
(function() {
    emailjs.init("zV8Z-Vs0ryCJ-ASpi");
})();

// verify form
const form = document.getElementById("fullForm");

// function to validate the form
function isFormValid() {
    // prevent default at the beginning
    event.preventDefault();

    // form inputs
    const name = document.querySelector("#fullName");
    const phone = document.querySelector("#phone");
    const email= document.querySelector("#email");
    const comments = document.querySelector("#comments");
    const errorList = document.getElementById("errorList");

    // initialize errors array
    let errors = [];
    errorList.classList.add("hide");
    name.classList.remove("error");
    email.classList.remove("error");
    phone.classList.remove("error");
    comments.classList.remove("error");

    // regex patterns
    const nameRegex = /[A-Za-z]\s[A-Za-z]/i;
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
 
    // clear any previous errors
    name.nextElementSibling.textContent = "";
    phone.nextElementSibling.textContent = "";
    email.nextElementSibling.textContent = "";
    comments.nextElementSibling.textContent = "";
    
    // check to see if name matches the nameRegex
    if (!name.value.match(nameRegex)) {
        errors.push("Please provide your full name.");
        name.classList.add("error");
    }
    
    // check to see if phone matches phoneRegex
    if (!phone.value.match(phoneRegex)) {
        errors.push("Invalid phone number.");
        phone.classList.add("error");
    }

    // check to confirm there's an email match the regexEmail
    if (!email.value.match(regexEmail) || email.value === "") {
        errors.push("Invalid email address.");
        email.classList.add("error");
    }
    
    // check if one of the radio buttons were selected
    const radio1 = document.getElementById("selectedPhone");
    const radio2 = document.getElementById("selectedEmail");

    if (!radio1.checked && !radio2.checked) {
        errors.push("Please select a preferred method of contact.");
        radio1.classList.add("error");
        radio2.classList.add("error");
    }

    // checking to see if there is anything in the comments box
    if (comments.value === "") {
        errors.push("Please leave a comment.");
        comments.classList.add("error");
    }
  
    // check the amount of errors, if there are errors, display them in the error container
    if (errors.length > 0) {
        const errorList = document.querySelector("#errorList");
        errorList.classList.remove("hide");
        errors.forEach((error) => {
          const li = document.createElement("li");
          li.innerHTML = error;
          errorList.appendChild(li);
        });
    }
};

// event listener for form
document.addEventListener("submit", isFormValid);

// reset form
const resetButton = document.getElementById("submit");
resetButton.addEventListener("click", () => {
    form.reset();
    errorContainer.innerHTML = "";
    fullName.classList.remove("error");
    phone.classList.remove("error");
    email.classList.remove("error");
    preferredMethodInputs[0].classList.remove("error");
    preferredMethodInputs[1].classList.remove("error");
    comments.classList.remove("error");
});


// light/dark mode functions
function toggleImage() {
    let img = document.getElementById("image");
    
    if (img.src.endsWith("light.png")) {
        img.src = "images/night.png";
    } else {
        img.src = "images/light.png";
    }
    return false;
}
    
function toggleMode() {
    let body = document.getElementsByTagName("body")[0];
    
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
    }
}

// discount generator
function randomNum() {
    let randNum = Math.floor(Math.random() * 10) + 1;
    let numInput = document.getElementById("userDisplay");
    let userInput = Number(numInput.value);
    let output = document.getElementById("message");

    if (randNum === 0 || userInput === 0 || userInput === "") {
        output.innerHTML = "Please enter a number between 1 and 10.";
    } else if (randNum === userInput) {
        output.innerHTML = `You've won a $${userInput} discount!`;
    } else {
        output.innerHTML = `Sorry no discounts for you. Try again!`;
    }
    event.preventDefault();
    output = "";
}
// event listener for random number generator
document.getElementById("submitButton").addEventListener("click", randomNum);


// booking form stuff
const bookingForm = document.getElementById('visitForm');

if (bookingForm) {
    // check if they've booked before
    const savedBooking = localStorage.getItem('bookingData');
    if (savedBooking) {
        const bookingData = JSON.parse(savedBooking);
        document.getElementById('name').value = bookingData.name || '';
        document.getElementById('email').value = bookingData.email || '';
        document.getElementById('date').value = bookingData.date || '';
        document.getElementById('time').value = bookingData.time || '';
        
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `<p>Welcome back, ${bookingData.name}! Your last booking was for ${bookingData.date}.</p>`;
        bookingForm.parentNode.insertBefore(welcomeMessage, bookingForm);
    }


    
    // handle form submit
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // show loading spinner
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitButton.disabled = true;
        
        // get the form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };
        
        try {
            // make the date look nice
            const bookingDate = new Date(formData.date);
            const formattedDate = `${bookingDate.getMonth() + 1}/${bookingDate.getDate()}`;
            
            // send the confirmation email
            await emailjs.send(
                "service_7j9h1rb",
                "template_o0xw6wb",
                {
                    email: formData.email,
                    to_name: formData.name,
                    booking_date: formData.date,
                    booking_time: formData.time,
                    reply_to: "rshrest8@asu.edu",
                    from_name: "fibberMagees"
                }
            );
            
            // save for next time
            localStorage.setItem('bookingData', JSON.stringify(formData));
            
            // clean up old welcome message
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.remove();
            }
            
            // show success message
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'confirmation-message';
            confirmationMessage.innerHTML = `
                <h3>Booking Confirmed!</h3>
                <p>Thank you, ${formData.name}! Your visit is scheduled for <span class="highlight-text">${formattedDate}</span> during the <span class="highlight-text">${formData.time}</span> session.</p>
                <p>We've sent a confirmation email to ${formData.email}.</p>
                <p>We'll see you soon at the pub, the Fibber Magees Pub!!</p>
            `;
            
            // clear form and show confirmation
            bookingForm.innerHTML = '';
            bookingForm.appendChild(confirmationMessage);
            
            // add button to book again
            const newBookingBtn = document.createElement('button');
            newBookingBtn.textContent = 'Make Another Booking';
            newBookingBtn.className = 'new-booking-btn';
            newBookingBtn.addEventListener('click', function() {
                location.reload();
            });
            bookingForm.appendChild(newBookingBtn);
            
        } catch (error) {
            // something went wrong
            console.error('booking error:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = `
                <p>Sorry, there was an error processing your booking. Please try again or contact us directly.</p>
                <p>Error: ${error.message}</p>
            `;
            submitButton.parentNode.insertBefore(errorMessage, submitButton);
            
            // reset the button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
}



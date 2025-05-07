document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwQUkvlninRPT72MQeTWB-2mseO0LPObVQEO8OC31A8xcSpZ3a-1t6AH5QAeTp2JMvh/exec';

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = new FormData(form);

        // Handle "Other" inputs properly
        document.querySelectorAll("input[type='checkbox'][value='other']").forEach(checkbox => {
            if (checkbox.checked) {
                let otherInput = checkbox.closest("label").querySelector("input[type='text']");
                if (otherInput && otherInput.value.trim() !== "") {
                    formData.append(checkbox.name, otherInput.value.trim());
                }
            }
        });

        // Validate required fields
        const requiredFields = ["Participant Name", "Designation","Organization", "Email", "Phone Number"];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = form.querySelector(`input[placeholder='Enter ${field.toLowerCase()}']`);
            if (input && input.value.trim() === "") {
                alert(`${field} is required.`);
                isValid = false;
            }
        });

        if (!isValid) return;

        // Send data to Google Sheets
        fetch(scriptURL, { method: "POST", body: formData })
        .then(response => {
            console.log("Success!", response);
            alert("Thank you for registering! Your response has been recorded.");
            form.reset();
            industryInterestGroup.style.display = "none"; // Hide industry interest field after reset
        })
        .catch(error => console.error("Error!", error.message));
    });

    // Function to toggle "Other" input field
    function toggleOtherInput(checkbox) {
        const otherInput = checkbox.closest("label").querySelector("input[type='text']");
        if (otherInput) {
            otherInput.style.display = checkbox.checked ? "inline-block" : "none";
            if (!checkbox.checked) {
                otherInput.value = ""; // Clear input when unchecked
            }
        }
    }

    // Apply the toggle function to all "Other" checkboxes
    document.querySelectorAll("input[type='checkbox'][value='other']").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            toggleOtherInput(this);
        });
        toggleOtherInput(checkbox); // Initialize visibility based on pre-checked state
    });

    // Apply the same logic for the second question
    document.querySelectorAll(".checkbox-group input[type='checkbox']").forEach(checkbox => {
        if (checkbox.parentNode.textContent.includes("Other:")) {
            checkbox.addEventListener("change", function () {
                toggleOtherInput(this);
            });
        }
    });

    // === Odisha Expansion Conditional Logic ===
    const expandOptions = document.getElementsByName("expand-odisha");
    const industryInterestGroup = document.getElementById("industry-interest-group");

    expandOptions.forEach(option => {
        option.addEventListener("change", function () {
            industryInterestGroup.style.display = this.value === "yes" ? "block" : "none";
        });
    });

});


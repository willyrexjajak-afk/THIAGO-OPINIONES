/* =====================================
   THIAGO Hotel Campestre
   script.js
   Interactividad para calificaciones por estrellas
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#surveyForm");
  const progressFill = document.getElementById("progressFill");
  const ratingGroups = document.querySelectorAll(".rating-group");

  const updateProgress = () => {
    if (!form || !progressFill) {
      return;
    }

    const controls = Array.from(form.querySelectorAll("input:not([type='hidden']), select, textarea"));
    const totalSteps = controls.length + ratingGroups.length;
    let completedSteps = 0;

    controls.forEach((control) => {
      const value = control.value.trim();
      if (value) {
        completedSteps += 1;
      }
    });

    ratingGroups.forEach((group) => {
      const hiddenInput = group.querySelector("input[type='hidden']");
      if (hiddenInput && Number(hiddenInput.value) > 0) {
        completedSteps += 1;
      }
    });

    const percentage = Math.round((completedSteps / totalSteps) * 100);
    progressFill.style.width = `${Math.max(percentage, 6)}%`;
  };

  const updateFieldState = (control) => {
    const field = control.closest(".field");
    if (!field) {
      return;
    }

    const hasValue = control.value.trim() !== "";
    field.classList.toggle("is-valid", hasValue);
    field.classList.toggle("is-invalid", !hasValue && control.hasAttribute("required"));
  };

  const validateForm = () => {
    let isValid = true;

    form.querySelectorAll("input, select, textarea").forEach((control) => {
      if (!control.hasAttribute("required")) {
        return;
      }

      const field = control.closest(".field");
      const isFilled = control.value.trim() !== "";

      if (!isFilled) {
        isValid = false;
        field?.classList.add("is-invalid");
        field?.classList.remove("is-valid");
      } else {
        field?.classList.remove("is-invalid");
        field?.classList.add("is-valid");
      }
    });

    return isValid;
  };

  ratingGroups.forEach((group) => {
    const starsContainer = group.querySelector(".stars");
    const hiddenInput = group.querySelector("input[type='hidden']");

    if (!starsContainer || !hiddenInput) {
      return;
    }

    const createStars = () => {
      starsContainer.innerHTML = "";

      for (let i = 1; i <= 5; i++) {
        const starButton = document.createElement("button");
        starButton.type = "button";
        starButton.className = "star";
        starButton.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.75l2.75 5.58 6.16.9-4.45 4.33 1.05 6.14L12 17.5 6.49 19.7l1.05-6.14L3.09 9.23l6.16-.9L12 2.75z" />
          </svg>`;
        starButton.setAttribute("aria-label", `${i} de 5 estrellas`);
        starButton.dataset.value = String(i);

        starButton.addEventListener("mouseenter", () => previewStars(i));
        starButton.addEventListener("focus", () => previewStars(i));
        starButton.addEventListener("click", () => {
          hiddenInput.value = String(i);
          setStars(i);
          updateProgress();
        });

        starsContainer.appendChild(starButton);
      }
    };

    const previewStars = (value) => {
      const starButtons = starsContainer.querySelectorAll(".star");
      const selectedValue = Number(hiddenInput.value) || 0;

      starButtons.forEach((button, index) => {
        const isPreviewed = index < value;
        button.classList.toggle("is-preview", isPreviewed);
        button.classList.toggle("active", index < selectedValue);
      });
    };

    const setStars = (value) => {
      const starButtons = starsContainer.querySelectorAll(".star");

      starButtons.forEach((button, index) => {
        button.classList.toggle("active", index < value);
        button.classList.remove("is-preview");
      });
    };

    starsContainer.addEventListener("mouseleave", () => {
      const selectedValue = Number(hiddenInput.value) || 0;
      setStars(selectedValue);
    });

    createStars();
    setStars(Number(hiddenInput.value) || 0);
  });

  form.querySelectorAll("input, select, textarea").forEach((control) => {
    control.addEventListener("input", () => {
      updateFieldState(control);
      updateProgress();
    });
    control.addEventListener("change", () => {
      updateFieldState(control);
      updateProgress();
    });
    control.addEventListener("blur", () => {
      updateFieldState(control);
    });
  });

  if (form) {
    form.addEventListener("submit", (event) => {
      const isValid = validateForm();

      if (!isValid) {
        event.preventDefault();
        return;
      }
    });
  }

  updateProgress();
});
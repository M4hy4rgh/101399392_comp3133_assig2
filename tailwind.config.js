/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
            "back": "url('/assets/img/backPic1.jpg')",
            "back2": "url('/assets/img/backPic2.jpg')",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    colors: {
      orange: "#ea580c",
    },
  },
};

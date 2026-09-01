
import React, { useEffect, useRef } from "react";
import "../styles/Landing.css";
import bookImage from "../assets/images/book.png";


export default function Landing() {
  const problemSectionRef = useRef(null);
  const featuresSectionRef = useRef(null);
  const workingSectionRef = useRef(null);

  useEffect(() => {
    const scrollSections = document.querySelectorAll(".scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    scrollSections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const redirectToSignup = () => {
    window.location.href = "/sign-up";
  };

  const redirectToLogin = () => {
    window.location.href = "/sign-in";
  };

  const handleFeaturesClick = (event) => {
    event.preventDefault();
    scrollToSection(featuresSectionRef);
  };

  const handleWorkingClick = (event) => {
    event.preventDefault();
    scrollToSection(workingSectionRef);
  };

  const handleProblemClick = (event) => {
    event.preventDefault();
    scrollToSection(problemSectionRef);
  };

  return (
    <>
      <nav className="nav-container">
        <div className="brand-logo">
          <svg
            width="60"
            height="60"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 27L32 14L56 27L32 40L8 27Z"
              fill="#6050F6"
            />
            <path
              d="M17 32V39C17 42.5 23.7 47 32 47C40.3 47 47 42.5 47 39V32L32 40L17 32Z"
              fill="#4F46E5"
            />
            <path
              d="M56 27V39"
              stroke="#6050F6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle
              cx="56"
              cy="41"
              r="2.5"
              fill="#6050F6"
            />
            <path
              d="M56 43.5V48"
              stroke="#6050F6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <h2 className="name">Study Coach</h2>
        </div>

        <div className="nav-links">
          <ul>
            <li>
              <div>
                <a href="#Features" onClick={handleFeaturesClick}>
                  Features
                </a>
              </div>

              <div>
                <a href="#Working" onClick={handleWorkingClick}>
                  How it Works
                </a>
              </div>

              <div>
                <a href="#Problem" onClick={handleProblemClick}>
                  Problem
                </a>
              </div>
            </li>
          </ul>
        </div>

        <div className="buttons">
          <button
            className="log-in"
            id="login-btn"
            onClick={redirectToLogin}
          >
            Log in
          </button>

          <button
            className="Get-Started"
            onClick={redirectToSignup}
          >
            Get Started
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-left">
          <h1>
            Stop guessing
            <br />
            what to study<span>.</span>
          </h1>

          <div className="article">
            <p>
              Your AI study coach for university — notes, resources,
              practice, study plans and guidance in one place.
            </p>
          </div>

          <div className="hero-buttons">
            <button
              className="cta"
              id="cta-btn"
              onClick={redirectToSignup}
            >
              Build My Study Plan →
            </button>

            <button
              className="secondary-cta"
              id="secondary-cta"
              onClick={() => scrollToSection(workingSectionRef)}
            >
              See How It Works
            </button>
          </div>

          <div className="hero-benefits">
            <span>✦</span>
            <span>Free for students</span>

            <b>•</b>

            <span>Takes less than a minute to set up</span>
          </div>
        </div>

        <div className="hero-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 900 580"
            width="900"
            height="580"
            fill="none"
          >
            <defs>
              <filter
                id="hero-shadow"
                x="-20%"
                y="-20%"
                width="140%"
                height="150%"
              >
                <feDropShadow
                  dx="0"
                  dy="12"
                  stdDeviation="18"
                  floodColor="#3730A3"
                  floodOpacity="0.12"
                />
              </filter>

              <linearGradient
                id="hero-purple"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#6046F5"
                />
                <stop
                  offset="100%"
                  stopColor="#7658FF"
                />
              </linearGradient>
            </defs>

            <rect
              x="20"
              y="20"
              width="860"
              height="540"
              rx="24"
              fill="#FFFFFF"
              stroke="#E7E7EF"
              filter="url(#hero-shadow)"
            />

            <rect
              x="20"
              y="20"
              width="220"
              height="540"
              rx="24"
              fill="#FFFFFF"
            />

            <rect
              x="218"
              y="20"
              width="22"
              height="540"
              fill="#FFFFFF"
            />

            <g transform="translate(48 52)">
              <path
                d="M0 12L20 3L40 12L20 21L0 12Z"
                fill="#6247F5"
              />

              <path
                d="M6 15V27C13 32 27 32 34 27V15L20 21L6 15Z"
                fill="#8068FF"
              />

              <path
                d="M37 13V25"
                stroke="#6247F5"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <text
                x="52"
                y="20"
                fontFamily="Arial, sans-serif"
                fontSize="17"
                fontWeight="700"
                fill="#17213C"
              >
                Study Coach
              </text>
            </g>

            <g transform="translate(205 62)">
              <path
                d="M0 0H12M0 6H12M0 12H12"
                stroke="#8A8E9D"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            <rect
              x="42"
              y="110"
              width="175"
              height="42"
              rx="11"
              fill="#F0ECFF"
            />

            <path
              d="M57 128L63 122L69 128V137H65V132H61V137H57V128Z"
              fill="#644CF2"
            />

            <text
              x="82"
              y="133"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="#604BF0"
            >
              Home
            </text>

            <rect
              x="57"
              y="174"
              width="13"
              height="14"
              rx="3"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="186"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Study Plan
            </text>

            <rect
              x="57"
              y="218"
              width="13"
              height="14"
              rx="3"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="230"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Subjects
            </text>

            <rect
              x="57"
              y="262"
              width="13"
              height="14"
              rx="3"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="274"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Resources
            </text>

            <circle
              cx="63.5"
              cy="319"
              r="6"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="323"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Practice
            </text>

            <circle
              cx="63.5"
              cy="363"
              r="6"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="367"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Quizzes
            </text>

            <circle
              cx="63.5"
              cy="407"
              r="6"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="411"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Progress
            </text>

            <circle
              cx="63.5"
              cy="451"
              r="6"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="455"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Goals
            </text>

            <circle
              cx="63.5"
              cy="495"
              r="6"
              stroke="#9AA0AE"
              strokeWidth="1.5"
            />

            <text
              x="82"
              y="499"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fill="#626979"
            >
              Settings
            </text>

            <text
              x="275"
              y="105"
              fontFamily="Arial, sans-serif"
              fontSize="24"
              fontWeight="700"
              fill="#111A31"
            >
              Good morning 👋
            </text>

            <text
              x="275"
              y="129"
              fontFamily="Arial, sans-serif"
              fontSize="12"
              fill="#7A8090"
            >
              Here's your plan for today
            </text>

            <rect
              x="275"
              y="155"
              width="390"
              height="250"
              rx="15"
              fill="#FFFFFF"
              stroke="#E5E6ED"
            />

            <text
              x="295"
              y="182"
              fontFamily="Arial, sans-serif"
              fontSize="14"
              fontWeight="700"
              fill="#20293D"
            >
              Today's Study Plan
            </text>

            <circle
              cx="302"
              cy="214"
              r="12"
              fill="#64C879"
            />

            <path
              d="M296 214L300 218L308 209"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text
              x="325"
              y="211"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fontWeight="700"
              fill="#263047"
            >
              Variables
            </text>

            <text
              x="325"
              y="229"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              fill="#7C8291"
            >
              Review notes · 20 min
            </text>

            <line
              x1="295"
              y1="245"
              x2="645"
              y2="245"
              stroke="#ECECF2"
            />

            <circle
              cx="302"
              cy="272"
              r="12"
              fill="#EEE9FF"
            />

            <path
              d="M297 272H307M303 268L307 272L303 276"
              stroke="#7358F5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text
              x="325"
              y="269"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fontWeight="700"
              fill="#263047"
            >
              Functions
            </text>

            <text
              x="325"
              y="287"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              fill="#7C8291"
            >
              Practice 10 questions · 30 min
            </text>

            <line
              x1="295"
              y1="303"
              x2="645"
              y2="303"
              stroke="#ECECF2"
            />

            <circle
              cx="302"
              cy="330"
              r="12"
              fill="#FFFFFF"
              stroke="#B8BDC9"
              strokeWidth="2"
            />

            <text
              x="325"
              y="327"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fontWeight="700"
              fill="#263047"
            >
              Loops
            </text>

            <text
              x="325"
              y="345"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              fill="#7C8291"
            >
              Mini quiz · 20 min
            </text>

            <rect
              x="685"
              y="155"
              width="170"
              height="110"
              rx="15"
              fill="#FFFFFF"
              stroke="#E5E6ED"
            />

            <circle
              cx="715"
              cy="188"
              r="17"
              fill="#FFF1E7"
            />

            <text
              x="706"
              y="195"
              fontFamily="Arial, sans-serif"
              fontSize="18"
            >
              🔥
            </text>

            <text
              x="740"
              y="191"
              fontFamily="Arial, sans-serif"
              fontSize="19"
              fontWeight="700"
              fill="#202A40"
            >
              7
            </text>

            <text
              x="740"
              y="210"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              fill="#7D8392"
            >
              day streak
            </text>

            <rect
              x="685"
              y="285"
              width="170"
              height="230"
              rx="15"
              fill="#FFFFFF"
              stroke="#E5E6ED"
            />

            <text
              x="705"
              y="315"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              fill="#7D8392"
            >
              Study Time
            </text>

            <text
              x="705"
              y="342"
              fontFamily="Arial, sans-serif"
              fontSize="19"
              fontWeight="700"
              fill="#263047"
            >
              2h 40m
            </text>

            <text
              x="705"
              y="361"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              fill="#7D8392"
            >
              Today
            </text>

            <line
              x1="705"
              y1="475"
              x2="835"
              y2="475"
              stroke="#E5E6ED"
            />

            <rect
              x="710"
              y="435"
              width="12"
              height="40"
              rx="3"
              fill="#A395FF"
            />

            <rect
              x="735"
              y="420"
              width="12"
              height="55"
              rx="3"
              fill="#765CF5"
            />

            <rect
              x="760"
              y="446"
              width="12"
              height="29"
              rx="3"
              fill="#B7ADFF"
            />

            <rect
              x="785"
              y="410"
              width="12"
              height="65"
              rx="3"
              fill="#6A52F3"
            />

            <rect
              x="810"
              y="430"
              width="12"
              height="45"
              rx="3"
              fill="#A99DFF"
            />

            <text
              x="711"
              y="492"
              fontFamily="Arial, sans-serif"
              fontSize="9"
              fill="#9095A3"
            >
              M
            </text>

            <text
              x="736"
              y="492"
              fontFamily="Arial, sans-serif"
              fontSize="9"
              fill="#9095A3"
            >
              T
            </text>

            <text
              x="761"
              y="492"
              fontFamily="Arial, sans-serif"
              fontSize="9"
              fill="#9095A3"
            >
              W
            </text>

            <text
              x="786"
              y="492"
              fontFamily="Arial, sans-serif"
              fontSize="9"
              fill="#9095A3"
            >
              T
            </text>

            <text
              x="811"
              y="492"
              fontFamily="Arial, sans-serif"
              fontSize="9"
              fill="#9095A3"
            >
              F
            </text>

            <rect
              x="275"
              y="425"
              width="390"
              height="90"
              rx="15"
              fill="#F8F8FB"
              stroke="#E8E8F0"
            />

            <text
              x="295"
              y="455"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="#293248"
            >
              Consistency today,
            </text>

            <text
              x="295"
              y="475"
              fontFamily="Arial, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="#293248"
            >
              Success tomorrow.
            </text>

            <circle
              cx="565"
              cy="455"
              r="16"
              fill="#F0C49D"
            />

            <path
              d="M548 445C550 432 570 430 577 444"
              fill="#26334C"
            />

            <path
              d="M545 505C548 481 555 474 565 474C576 474 584 484 587 505Z"
              fill="url(#hero-purple)"
            />

            <rect
              x="595"
              y="475"
              width="42"
              height="27"
              rx="3"
              fill="#D8D4FF"
            />

            <line
              x1="590"
              y1="505"
              x2="643"
              y2="505"
              stroke="#777C90"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M650 505C650 485 662 475 673 484"
              stroke="#65A95F"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M660 489C661 478 670 475 676 482"
              fill="#7BCB71"
            />

            <path
              d="M651 495C644 486 647 480 655 479"
              fill="#8BD77F"
            />
          </svg>
        </div>
      </div>

      <section
        id="Problem"
        className="scroll"
        ref={problemSectionRef}
      >
        <div className="heading">
          <h2>
            University shouldn't feel like a{" "}
            <span className="colored">scavenger hunt.</span>
          </h2>
        </div>

        <div className="problem">
          <div className="problem-1">
            <div className="svg">
              <svg
                width="200"
                height="230"
                viewBox="0 0 500 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="problem-shirt"
                    x1="170"
                    y1="350"
                    x2="370"
                    y2="590"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#41358F" />
                    <stop
                      offset="1"
                      stopColor="#2D236D"
                    />
                  </linearGradient>

                  <linearGradient
                    id="problem-skin"
                    x1="250"
                    y1="220"
                    x2="330"
                    y2="390"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFB083" />
                    <stop
                      offset="1"
                      stopColor="#F29468"
                    />
                  </linearGradient>

                  <linearGradient
                    id="problem-lavender"
                    x1="100"
                    y1="100"
                    x2="400"
                    y2="500"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F1EFFF" />
                    <stop
                      offset="1"
                      stopColor="#DCD7FA"
                    />
                  </linearGradient>

                  <filter
                    id="problem-shadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="6"
                      stdDeviation="8"
                      floodOpacity="0.12"
                    />
                  </filter>
                </defs>

                <path
                  d="M91 337C61 300 70 245 111 224C153 202 184 220 206 251C229 283 218 326 185 348C151 370 113 364 91 337Z"
                  fill="url(#problem-lavender)"
                />

                <path
                  d="M299 349C272 319 277 274 313 253C349 232 393 245 411 281C429 317 412 357 377 373C344 388 319 372 299 349Z"
                  fill="#E5E0FC"
                />

                <path
                  d="M105 455C78 420 90 376 123 357C158 337 200 350 216 383C233 417 218 458 184 475C150 492 123 480 105 455Z"
                  fill="#E8E3FC"
                />

                <g filter="url(#problem-shadow)">
                  <path
                    d="M53 80C53 49 78 25 109 25H146C177 25 202 49 202 80C202 110 178 134 148 135L165 153L133 137H109C78 137 53 112 53 80Z"
                    fill="#F1F0F8"
                  />
                </g>

                <text
                  x="128"
                  y="106"
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize="64"
                  fontWeight="700"
                  fill="#A8A9B8"
                >
                  ?
                </text>

                <g filter="url(#problem-shadow)">
                  <path
                    d="M203 25H271L307 61V139H203V25Z"
                    fill="#FFF7F5"
                  />

                  <path
                    d="M271 25V61H307"
                    fill="#FFD7D2"
                  />

                  <path
                    d="M271 25L307 61H271V25Z"
                    fill="#FFB8B1"
                  />

                  <rect
                    x="192"
                    y="70"
                    width="125"
                    height="55"
                    rx="10"
                    fill="#F04438"
                  />

                  <text
                    x="254"
                    y="108"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontSize="27"
                    fontWeight="800"
                    fill="white"
                  >
                    PDF
                  </text>
                </g>

                <g filter="url(#problem-shadow)">
                  <path
                    d="M354 77C354 47 378 24 408 24H438C468 24 492 47 492 77C492 107 468 130 438 130H421L403 148L405 130C376 128 354 106 354 77Z"
                    fill="#F0EFF8"
                  />
                </g>

                <circle
                  cx="397"
                  cy="78"
                  r="7"
                  fill="#A8A9B8"
                />

                <circle
                  cx="421"
                  cy="78"
                  r="7"
                  fill="#A8A9B8"
                />

                <circle
                  cx="445"
                  cy="78"
                  r="7"
                  fill="#A8A9B8"
                />

                <g filter="url(#problem-shadow)">
                  <rect
                    x="26"
                    y="170"
                    width="102"
                    height="68"
                    rx="15"
                    fill="#FF2929"
                  />

                  <path
                    d="M68 185L68 223L101 204L68 185Z"
                    fill="white"
                  />
                </g>

                <g filter="url(#problem-shadow)">
                  <circle
                    cx="425"
                    cy="190"
                    r="48"
                    fill="#43C95A"
                  />

                  <path
                    d="M403 184C403 174 410 166 420 166C429 166 438 173 440 182C442 192 435 202 426 205C421 207 416 205 412 203L402 207L405 197C403 193 403 189 403 184Z"
                    fill="white"
                  />

                  <path
                    d="M414 177C415 175 417 175 419 176L422 181C423 182 422 184 421 185L419 187C421 191 424 193 428 194L430 191C431 190 433 190 434 191L438 194C439 195 439 197 438 198C436 202 431 204 427 202C418 199 411 192 409 183C408 180 411 178 414 177Z"
                    fill="#43C95A"
                  />
                </g>

                <text
                  x="255"
                  y="205"
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize="42"
                  fontWeight="800"
                  fill="#4B4294"
                >
                  ?
                </text>

                <g>
                  <path
                    d="M35 286C35 264 53 247 76 247H115C138 247 156 264 156 286C156 308 138 325 115 325H96L82 338L84 325H76C53 325 35 308 35 286Z"
                    fill="#F1F0F8"
                  />

                  <circle
                    cx="70"
                    cy="286"
                    r="6"
                    fill="#A6A8B8"
                  />

                  <circle
                    cx="94"
                    cy="286"
                    r="6"
                    fill="#A6A8B8"
                  />

                  <circle
                    cx="118"
                    cy="286"
                    r="6"
                    fill="#A6A8B8"
                  />
                </g>

                <path
                  d="M117 600C117 515 123 431 167 389C188 369 214 359 250 359C290 359 325 370 345 394C381 437 388 522 388 600H117Z"
                  fill="url(#problem-shirt)"
                />

                <path
                  d="M249 345C249 345 246 382 228 398C245 416 276 420 300 397C282 382 280 346 280 346L249 345Z"
                  fill="url(#problem-skin)"
                />

                <path
                  d="M195 222C195 180 225 150 270 150C316 150 342 181 342 225V286C342 331 314 359 271 359C228 359 195 330 195 286V222Z"
                  fill="url(#problem-skin)"
                />

                <path
                  d="M192 227C182 198 188 166 212 146C234 127 275 123 303 137C327 149 345 172 344 203C343 215 336 225 326 229C324 211 315 199 301 192C287 203 271 207 250 204C230 201 214 190 204 177C204 198 201 215 192 227Z"
                  fill="#172044"
                />

                <path
                  d="M210 162C215 138 239 122 269 124C293 125 315 136 326 154C309 145 290 145 274 151C252 159 230 166 210 162Z"
                  fill="#172044"
                />

                <path
                  d="M219 238C231 230 244 231 254 238"
                  stroke="#202544"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <path
                  d="M287 238C299 231 312 232 322 239"
                  stroke="#202544"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <ellipse
                  cx="240"
                  cy="260"
                  rx="5"
                  ry="8"
                  fill="#202544"
                />

                <ellipse
                  cx="303"
                  cy="260"
                  rx="5"
                  ry="8"
                  fill="#202544"
                />

                <path
                  d="M272 258C267 271 265 280 269 284C273 287 278 287 282 284"
                  stroke="#C76E5C"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d="M252 306C263 311 276 311 287 305"
                  stroke="#202544"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d="M196 248C184 246 180 257 183 270C185 281 191 287 198 285"
                  fill="url(#problem-skin)"
                />

                <path
                  d="M331 227C341 208 351 201 361 205C369 208 371 216 367 226L346 279C341 292 331 301 320 296C311 292 310 281 314 271L331 227Z"
                  fill="url(#problem-skin)"
                />

                <path
                  d="M337 226L352 210"
                  stroke="#D87964"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d="M342 232L359 218"
                  stroke="#D87964"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d="M346 238L364 226"
                  stroke="#D87964"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d="M319 385C344 377 364 387 375 408L417 486C428 507 420 531 399 541C378 550 355 539 346 518L306 438C297 419 301 394 319 385Z"
                  fill="url(#problem-shirt)"
                />

                <path
                  d="M228 393C242 410 274 417 300 395"
                  stroke="#29226C"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                <path
                  d="M162 418C148 454 146 521 147 600"
                  stroke="#29236F"
                  strokeWidth="18"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                <path
                  d="M331 430C347 462 357 499 361 535"
                  stroke="#5147A5"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.35"
                />

                <circle
                  cx="105"
                  cy="380"
                  r="8"
                  fill="#D9D4F7"
                />

                <circle
                  cx="397"
                  cy="345"
                  r="7"
                  fill="#D9D4F7"
                />

                <circle
                  cx="438"
                  cy="278"
                  r="5"
                  fill="#D9D4F7"
                />

                <path
                  d="M171 215L155 196"
                  stroke="#B9B1E8"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                <path
                  d="M377 237L391 220"
                  stroke="#B9B1E8"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                <path
                  d="M154 345L137 355"
                  stroke="#B9B1E8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="problem-heading">
              <h3>"Bhai, Kya Parhna hai?"</h3>
              <p>
                Random PDF's, YouTube Videos, Whatsapp groups, Senior
                advice.
              </p>
            </div>
          </div>

          <div className="problem-2">
            <img src={bookImage} alt="books" />

            <div className="problem-heading-2">
              <h3>"Which Book?"</h3>
              <p>
                Five recommendations. Zero idea which one matters
              </p>
            </div>
          </div>

          <div className="problem-card problem-card-3">
            <div className="problem-card-3__illustration">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="70"
                  y="15"
                  width="110"
                  height="130"
                  rx="10"
                  fill="#FFFFFF"
                  stroke="#E3E8E6"
                  strokeWidth="2"
                />

                <rect
                  x="70"
                  y="15"
                  width="110"
                  height="28"
                  rx="10"
                  fill="#EF5350"
                />

                <rect
                  x="70"
                  y="33"
                  width="110"
                  height="10"
                  fill="#EF5350"
                />

                <text
                  x="125"
                  y="34"
                  fontFamily="'Inter', sans-serif"
                  fontSize="13"
                  fontWeight="700"
                  fill="#FFFFFF"
                  textAnchor="middle"
                >
                  EXAM
                </text>

                <rect
                  x="82"
                  y="55"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#FFB74D"
                />

                <rect
                  x="102"
                  y="55"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#4FC3A1"
                />

                <rect
                  x="122"
                  y="55"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#EF5350"
                />

                <rect
                  x="142"
                  y="55"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#90A4AE"
                />

                <rect
                  x="162"
                  y="55"
                  width="10"
                  height="14"
                  rx="3"
                  fill="#FFB74D"
                />

                <rect
                  x="82"
                  y="75"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#90A4AE"
                />

                <rect
                  x="102"
                  y="75"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#FFB74D"
                />

                <rect
                  x="122"
                  y="75"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#4FC3A1"
                />

                <rect
                  x="142"
                  y="75"
                  width="14"
                  height="14"
                  rx="3"
                  fill="#EF5350"
                />

                <rect
                  x="162"
                  y="75"
                  width="10"
                  height="14"
                  rx="3"
                  fill="#90A4AE"
                />

                <rect
                  x="82"
                  y="100"
                  width="88"
                  height="6"
                  rx="3"
                  fill="#E3E8E6"
                />

                <rect
                  x="82"
                  y="112"
                  width="70"
                  height="6"
                  rx="3"
                  fill="#E3E8E6"
                />

                <rect
                  x="82"
                  y="124"
                  width="80"
                  height="6"
                  rx="3"
                  fill="#E3E8E6"
                />

                <ellipse
                  cx="85"
                  cy="188"
                  rx="75"
                  ry="8"
                  fill="#000000"
                  opacity="0.06"
                />

                <path
                  d="M25 188 C25 150 45 128 85 128 C125 128 145 150 145 188 Z"
                  fill="#2E7D6B"
                />

                <path
                  d="M100 140 C112 132 120 118 116 105 C113 96 100 96 97 106 C94 116 96 132 100 140 Z"
                  fill="#2E7D6B"
                />

                <rect
                  x="70"
                  y="108"
                  width="24"
                  height="20"
                  rx="8"
                  fill="#F2C29A"
                />

                <circle
                  cx="82"
                  cy="88"
                  r="34"
                  fill="#F5CBA0"
                />

                <path
                  d="M48 88 C46 55 62 40 82 40 C104 40 120 56 118 86 C112 76 106 70 96 68 C90 76 78 78 68 72 C62 80 54 82 48 88 Z"
                  fill="#26232A"
                />

                <path
                  d="M92 66 C104 60 116 66 118 80 C119 90 112 98 102 98 C96 98 90 92 90 84 C90 78 90 70 92 66 Z"
                  fill="#F2C29A"
                />

                <path
                  d="M65 82 Q72 76 79 81"
                  stroke="#26232A"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                <circle
                  cx="68"
                  cy="90"
                  r="3"
                  fill="#26232A"
                />

                <circle
                  cx="86"
                  cy="90"
                  r="3"
                  fill="#26232A"
                />

                <path
                  d="M68 104 Q78 98 88 104"
                  stroke="#26232A"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />

                <rect
                  x="5"
                  y="188"
                  width="160"
                  height="8"
                  rx="4"
                  fill="#D8E2DE"
                />
              </svg>
            </div>

            <div className="problem-card-3__content">
              <div className="problem-card-3__title">
                "Abhi bohat time hai..."
              </div>

              <div className="problem-card-3__text">
                And then suddenly,
                <br />
                exams are next week.
                <br />
                Panic mode: ON.
              </div>
            </div>
          </div>
        </div>

        <div className="heading-2">
          <h2>
            Everything you need.{" "}
            <span className="colored-heading">
              In one place
            </span>
          </h2>
        </div>
      </section>

      <section className="study-features">
        <section
          id="Features"
          className="scroll"
          ref={featuresSectionRef}
        >
          <div className="sf-features-grid">
            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon icon-purple"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path
                  d="M16 7h24l12 12v38H16z"
                  fill="#eeeaff"
                />
                <path
                  d="M40 7v13h12"
                  fill="#c8bfff"
                />
                <path
                  d="M40 7l12 13H40z"
                  fill="#a99cff"
                />
                <rect
                  x="24"
                  y="30"
                  width="21"
                  height="3"
                  rx="1.5"
                  fill="#7c69ed"
                />
                <rect
                  x="24"
                  y="37"
                  width="16"
                  height="3"
                  rx="1.5"
                  fill="#9b8df2"
                />
                <rect
                  x="24"
                  y="44"
                  width="19"
                  height="3"
                  rx="1.5"
                  fill="#b1a6f5"
                />
              </svg>

              <h3>AI Study Plans</h3>

              <p>
                Personalized plans that
                <br />
                tell you what to study
                <br />
                every day.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path
                  d="M10 14c8-5 17-5 22 1v38c-5-6-14-7-22-2z"
                  fill="#72c69a"
                />
                <path
                  d="M54 14c-8-5-17-5-22 1v38c5-6 14-7 22-2z"
                  fill="#b9e8cf"
                />
                <path
                  d="M32 15v38"
                  stroke="#3ba874"
                  strokeWidth="3"
                />
                <path
                  d="M17 21c5-2 9-1 13 1M17 28c5-2 9-1 13 1M17 35c5-2 9-1 13 1"
                  fill="none"
                  stroke="#e5f7ec"
                  strokeWidth="2"
                />
                <path
                  d="M34 22c4-2 8-3 13-1M34 29c4-2 8-3 13-1M34 36c4-2 8-3 13-1"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>

              <h3>Notes &amp; Resources</h3>

              <p>
                Curated notes, books
                <br />
                and high-quality
                <br />
                resources.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle
                  cx="32"
                  cy="31"
                  r="22"
                  fill="#8070ee"
                />

                <path
                  d="M25 24c1-5 5-8 10-8 7 0 11 5 11 11 0 6-4 9-9 11-4 1-5 4-5 7"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <circle
                  cx="32"
                  cy="49"
                  r="2.5"
                  fill="#ffffff"
                />

                <path
                  d="M12 53h9"
                  stroke="#c2b9ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <h3>Practice Questions</h3>

              <p>
                Topic-wise questions
                <br />
                to strengthen your
                <br />
                concepts.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path
                  d="M16 9h27l9 9v36H16z"
                  fill="#ffd873"
                />

                <path
                  d="M43 9v10h9"
                  fill="#ffca42"
                />

                <path
                  d="M43 9l9 10H43z"
                  fill="#ffe49a"
                />

                <circle
                  cx="27"
                  cy="29"
                  r="3"
                  fill="#ffffff"
                />

                <path
                  d="M35 29h10"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle
                  cx="27"
                  cy="40"
                  r="3"
                  fill="#ffffff"
                />

                <path
                  d="M35 40h10"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M24 29l2 2 4-5"
                  fill="none"
                  stroke="#e5b52d"
                  strokeWidth="2"
                />
              </svg>

              <h3>Quizzes</h3>

              <p>
                Test yourself with smart
                <br />
                quizzes and instant
                <br />
                feedback.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path
                  d="M17 8h26l9 9v39H17z"
                  fill="#f58abb"
                />

                <path
                  d="M43 8v10h9"
                  fill="#ef68a4"
                />

                <path
                  d="M43 8l9 10H43z"
                  fill="#ffc0dc"
                />

                <rect
                  x="25"
                  y="29"
                  width="20"
                  height="3"
                  rx="1.5"
                  fill="#ffffff"
                />

                <rect
                  x="25"
                  y="36"
                  width="15"
                  height="3"
                  rx="1.5"
                  fill="#ffffff"
                />

                <rect
                  x="25"
                  y="43"
                  width="18"
                  height="3"
                  rx="1.5"
                  fill="#ffffff"
                />
              </svg>

              <h3>Past Papers</h3>

              <p>
                University past papers
                <br />
                with solutions and
                <br />
                topics.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <rect
                  x="12"
                  y="13"
                  width="40"
                  height="40"
                  rx="6"
                  fill="#5c91f5"
                />

                <rect
                  x="16"
                  y="20"
                  width="32"
                  height="29"
                  rx="3"
                  fill="#ffffff"
                />

                <path
                  d="M20 9v13M44 9v13"
                  stroke="#4381ed"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M16 27h32"
                  stroke="#d9e6ff"
                  strokeWidth="2"
                />

                <circle
                  cx="24"
                  cy="34"
                  r="2"
                  fill="#6a9bf1"
                />

                <circle
                  cx="32"
                  cy="34"
                  r="2"
                  fill="#6a9bf1"
                />

                <circle
                  cx="40"
                  cy="34"
                  r="2"
                  fill="#6a9bf1"
                />
              </svg>

              <h3>Daily Goals</h3>

              <p>
                Set daily goals and
                <br />
                stay consistent.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <rect
                  x="13"
                  y="11"
                  width="38"
                  height="43"
                  rx="5"
                  fill="#dcd5ff"
                />

                <path
                  d="M20 17h24v29H20z"
                  fill="#b9b0f7"
                />

                <path
                  d="M27 22v18M35 22v18"
                  stroke="#ffffff"
                  strokeWidth="3"
                />

                <path
                  d="M23 40h20"
                  stroke="#ffffff"
                  strokeWidth="3"
                />

                <path
                  d="M27 36l5-5 4 3 7-8"
                  fill="none"
                  stroke="#705dea"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M39 26h4v4"
                  fill="none"
                  stroke="#705dea"
                  strokeWidth="3"
                />
              </svg>

              <h3>Progress Tracking</h3>

              <p>
                Track your progress
                <br />
                and improve
                <br />
                every day.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path
                  d="M10 22c0-8 7-13 16-13h11c10 0 17 5 17 13v9c0 8-7 13-17 13H27l-10 8 2-9c-6-3-9-8-9-14z"
                  fill="#8bd7c4"
                />

                <path
                  d="M20 35c4 3 10 3 14 0"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <circle
                  cx="23"
                  cy="27"
                  r="3"
                  fill="#ffffff"
                />

                <circle
                  cx="32"
                  cy="27"
                  r="3"
                  fill="#ffffff"
                />

                <circle
                  cx="41"
                  cy="27"
                  r="3"
                  fill="#ffffff"
                />

                <path
                  d="M36 39c5 0 10 3 12 7"
                  fill="none"
                  stroke="#45bba1"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>

              <h3>AI Tutor</h3>

              <p>
                Get AI explanations
                <br />
                for anything you
                <br />
                don't understand.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path
                  d="M32 7l6.5 13.5L53 22.5l-10.5 10.3L45 47.5 32 40.7 19 47.5l2.5-14.7L11 22.5l14.5-2z"
                  fill="#ffc943"
                />

                <path
                  d="M32 12l5 10.2 11.3 1.6-8.2 8 1.9 11.3L32 37.8l-10 5.3 1.9-11.3-8.2-8L27 22.2z"
                  fill="#ffd968"
                />
              </svg>

              <h3>Exam Ready</h3>

              <p>
                Be fully prepared
                <br />
                and confident for
                <br />
                your exams.
              </p>
            </article>

            <article className="sf-feature-card">
              <svg
                className="sf-feature-icon"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path
                  d="M32 53S10 40 10 25c0-8 5-13 12-13 5 0 8 3 10 7 2-4 5-7 10-7 7 0 12 5 12 13 0 15-22 28-22 28z"
                  fill="#f18ab6"
                />

                <path
                  d="M32 47S16 37 16 26c0-5 3-8 7-8 4 0 7 3 9 7 2-4 5-7 9-7 4 0 7 3 7 8 0 11-16 21-16 21z"
                  fill="#f59bc3"
                />
              </svg>

              <h3>Motivation</h3>

              <p>
                Streaks, badges and
                <br />
                reminders to keep
                <br />
                you going.
              </p>
            </article>
          </div>
        </section>
        <section
        className="scroll"
        id="Working"
        ref={workingSectionRef}
      >
        <div className="sf-how-it-works">
          <div className="sf-how-heading">
            <svg
              className="sf-doodle sf-doodle-left"
              viewBox="0 0 50 50"
              aria-hidden="true"
            >
              <path
                d="M40 10C25 10 12 18 15 31c2 9 13 11 20 4"
                fill="none"
                stroke="#b6a9ff"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M29 28l7 7-9 1"
                fill="none"
                stroke="#b6a9ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <h2>How it works</h2>

            <svg
              className="sf-doodle sf-doodle-right"
              viewBox="0 0 50 50"
              aria-hidden="true"
            >
              <path
                d="M10 10c15 0 28 8 25 21-2 9-13 11-20 4"
                fill="none"
                stroke="#b6a9ff"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M21 28l-7 7 9 1"
                fill="none"
                stroke="#b6a9ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="sf-steps">
            <div className="sf-connector"></div>

            <article className="sf-step-card">
              <span className="sf-step-number">1</span>

              <svg
                className="sf-step-icon"
                viewBox="0 0 70 70"
                aria-hidden="true"
              >
                <circle
                  cx="35"
                  cy="22"
                  r="9"
                  fill="#7965ed"
                />

                <circle
                  cx="20"
                  cy="30"
                  r="7"
                  fill="#8d7bf1"
                />

                <circle
                  cx="50"
                  cy="30"
                  r="7"
                  fill="#8d7bf1"
                />

                <path
                  d="M9 52c1-10 8-16 18-16s17 6 18 16"
                  fill="#7965ed"
                />

                <path
                  d="M39 52c1-8 6-13 14-13 7 0 12 5 13 13"
                  fill="#a294f4"
                />

                <path
                  d="M13 34l-7 5M57 34l7 5"
                  stroke="#b8adfa"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              <h3>Tell us about you</h3>

              <p>
                We ask a few quick
                <br />
                questions.
              </p>
            </article>

            <article className="sf-step-card">
              <span className="sf-step-number">2</span>

              <svg
                className="sf-step-icon"
                viewBox="0 0 70 70"
                aria-hidden="true"
              >
                <rect
                  x="18"
                  y="14"
                  width="34"
                  height="45"
                  rx="4"
                  fill="#aaa0f4"
                />

                <rect
                  x="24"
                  y="22"
                  width="22"
                  height="3"
                  rx="1.5"
                  fill="#ffffff"
                />

                <circle
                  cx="27"
                  cy="34"
                  r="2.5"
                  fill="#ffffff"
                />

                <path
                  d="M34 34h10"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle
                  cx="27"
                  cy="43"
                  r="2.5"
                  fill="#ffffff"
                />

                <path
                  d="M34 43h10"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M28 10v8M42 10v8"
                  stroke="#8070ed"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>

              <h3>Get your study plan</h3>

              <p>
                Your AI study plan is
                <br />
                ready in seconds.
              </p>
            </article>

            <article className="sf-step-card">
              <span className="sf-step-number">3</span>

              <svg
                className="sf-step-icon"
                viewBox="0 0 70 70"
                aria-hidden="true"
              >
                <circle
                  cx="35"
                  cy="35"
                  r="22"
                  fill="none"
                  stroke="#7663e9"
                  strokeWidth="6"
                />

                <circle
                  cx="35"
                  cy="35"
                  r="12"
                  fill="none"
                  stroke="#8d7bf1"
                  strokeWidth="5"
                />

                <circle
                  cx="35"
                  cy="35"
                  r="4"
                  fill="#7965ed"
                />

                <path
                  d="M38 32l20-17"
                  stroke="#7663e9"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M53 15h7v7"
                  fill="none"
                  stroke="#7663e9"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h3>Follow daily goals</h3>

              <p>
                Complete tasks, practice
                <br />
                and learn step by step.
              </p>
            </article>

            <article className="sf-step-card">
              <span className="sf-step-number">4</span>

              <svg
                className="sf-step-icon"
                viewBox="0 0 70 70"
                aria-hidden="true"
              >
                <path
                  d="M17 20h36v7c0 14-8 22-18 22S17 41 17 27z"
                  fill="#ffc83d"
                />

                <path
                  d="M17 25H8v4c0 9 5 15 14 15M53 25h9v4c0 9-5 15-14 15"
                  fill="none"
                  stroke="#f2b522"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M35 49v9"
                  stroke="#f2b522"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M25 59h20"
                  stroke="#f2b522"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M26 27l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"
                  fill="#ffffff"
                />
              </svg>

              <h3>Crush your exams</h3>

              <p>
                Stay consistent and
                <br />
                achieve your goals.
              </p>
            </article>
          </div>
        </div>
      </section>

      </section>

            
    </>
  );
}

